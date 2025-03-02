document.addEventListener("DOMContentLoaded", function () {
    console.log("Página carregada. Carregando dados do localStorage...");
    const estoqueTable = document.getElementById("estoqueTable").getElementsByTagName('tbody')[0];
    const formularioAdicionar = document.getElementById("formularioAdicionar");
    const formAdicionar = document.getElementById("formAdicionar");
    let estoque = JSON.parse(localStorage.getItem("estoque")) || [];

    // Função para mostrar o formulário
    window.mostrarFormulario = function () {
        formularioAdicionar.style.display = "block";
    };

    // Função para ocultar o formulário
    window.ocultarFormulario = function () {
        formularioAdicionar.style.display = "none";
        formAdicionar.reset(); // Limpa os campos do formulário
    };

    // Função para adicionar item manualmente
    formAdicionar.addEventListener("submit", function (event) {
        event.preventDefault(); // Evita o recarregamento da página

        const codigo = document.getElementById("codigo").value;
        const produto = document.getElementById("produto").value;
        const quantidade = parseInt(document.getElementById("quantidade").value);
        const dataValidade = new Date(document.getElementById("dataValidade").value);

        if (codigo && produto && !isNaN(quantidade) && dataValidade instanceof Date && !isNaN(dataValidade)) {
            const diasParaVencer = calcularDiasParaVencer(dataValidade);

            estoque.push({
                codigo,
                produto,
                quantidade,
                dataValidade,
                diasParaVencer,
                situacao: calcularSituacao(diasParaVencer)
            });

            atualizarTabela();
            ocultarFormulario(); // Oculta o formulário após adicionar o item
        } else {
            alert("Por favor, preencha todos os campos corretamente.");
        }
    });

    // Função para atualizar a tabela
    function atualizarTabela() {
        console.log("Atualizando tabela...");
        estoqueTable.innerHTML = ""; // Limpa a tabela antes de atualizar
        estoque.forEach((item, index) => {
            const row = estoqueTable.insertRow();
            row.insertCell(0).textContent = item.codigo;
            row.insertCell(1).textContent = item.produto;
            row.insertCell(2).textContent = item.quantidade;

            // Verifica se item.dataValidade é um objeto Date válido
            const dataValidade = item.dataValidade instanceof Date ? item.dataValidade : new Date(item.dataValidade);
            row.insertCell(3).textContent = dataValidade ? dataValidade.toISOString().split('T')[0] : "N/A";

            row.insertCell(4).textContent = item.diasParaVencer !== null ? item.diasParaVencer : "N/A";

            // Adiciona a situação com cores
            const situacaoCell = row.insertCell(5);
            situacaoCell.textContent = item.situacao;
            situacaoCell.className = item.situacao.replace(/ /g, "-"); // Substitui espaços por hífens
            situacaoCell.style.backgroundColor = getCorSituacao(item.situacao);

            // Adiciona botão de editar
            const editarCell = row.insertCell(6);
            const editarBtn = document.createElement("button");
            editarBtn.textContent = "Editar";
            editarBtn.addEventListener("click", () => editarItem(index));
            editarCell.appendChild(editarBtn);

            // Adiciona botão de remover
            const removerCell = row.insertCell(7);
            const removerBtn = document.createElement("button");
            removerBtn.textContent = "Remover";
            removerBtn.classList.add("btn-remover"); // Adiciona classe para estilização
            removerBtn.addEventListener("click", () => removerItem(index));
            removerCell.appendChild(removerBtn);
        });

        // Salva os dados no localStorage
        localStorage.setItem("estoque", JSON.stringify(estoque));
        console.log("Tabela atualizada e dados salvos no localStorage.");
    }

    // Função para calcular os dias para vencer
    function calcularDiasParaVencer(dataValidade) {
        const hoje = new Date();
        const diffTime = dataValidade - hoje;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    // Função para calcular a situação
    function calcularSituacao(diasParaVencer) {
        if (diasParaVencer === null || isNaN(diasParaVencer)) {
            return "Data inválida";
        } else if (diasParaVencer < 0) {
            return "Vencido";
        } else if (diasParaVencer === 0) {
            return "Vence hoje";
        } else if (diasParaVencer <= 10) {
            return "Prazo estourado";
        } else {
            return "Dentro da validade";
        }
    }

    // Função para obter a cor da situação
    function getCorSituacao(situacao) {
        switch (situacao) {
            case "Vencido": return "#ffcccc";
            case "Vence hoje": return "#ffebcc";
            case "Prazo estourado": return "#fff3cc";
            case "No prazo para retirada": return "#ccffcc";
            case "Dentro da validade": return "#ccf2ff";
            default: return "#ffffff";
        }
    }

    // Função para remover um item
    function removerItem(index) {
        if (confirm("Tem certeza que deseja remover este produto?")) {
            estoque.splice(index, 1);
            atualizarTabela();
        }
    }

    // Função para editar um item
    function editarItem(index) {
        const item = estoque[index];
        const novoCodigo = prompt("Editar código:", item.codigo);
        const novoProduto = prompt("Editar produto:", item.produto);
        const novaQuantidade = prompt("Editar quantidade:", item.quantidade);
        const novaDataValidade = prompt("Editar data de validade (AAAA-MM-DD):", item.dataValidade ? item.dataValidade.toISOString().split('T')[0] : "");

        if (novoCodigo && novoProduto && novaQuantidade && novaDataValidade) {
            const novaDataValidadeObj = new Date(novaDataValidade);
            const diasParaVencer = calcularDiasParaVencer(novaDataValidadeObj);

            estoque[index] = {
                codigo: novoCodigo,
                produto: novoProduto,
                quantidade: novaQuantidade,
                dataValidade: novaDataValidadeObj,
                diasParaVencer,
                situacao: calcularSituacao(diasParaVencer)
            };

            atualizarTabela();
        }
    }

    // Função para importar dados
    window.importarDados = function () {
        const fileInput = document.getElementById("fileInput");
        const file = fileInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

                // Converter os dados para o formato esperado
                estoque = json.slice(1).map(row => {
                    let dataValidade;

                    // Verifica se a data é um número (formato Excel)
                    if (typeof row[3] === 'number') {
                        // Converter data do Excel (número de dias desde 1900-01-01) para objeto Date
                        const excelEpoch = new Date(1900, 0, 1); // 1 de janeiro de 1900
                        dataValidade = new Date(excelEpoch.getTime() + (row[3] - 1) * 86400 * 1000);
                    } else if (typeof row[3] === 'string') {
                        // Se a data estiver em formato de texto, tentar converter diretamente
                        dataValidade = new Date(row[3]);
                    } else {
                        dataValidade = null;
                    }

                    const hoje = new Date();
                    const diffTime = dataValidade ? dataValidade - hoje : null;
                    const diasParaVencer = diffTime ? Math.ceil(diffTime / (1000 * 60 * 60 * 24)) : null;

                    return {
                        codigo: row[0],
                        produto: row[1],
                        quantidade: row[2],
                        dataValidade,
                        diasParaVencer,
                        situacao: calcularSituacao(diasParaVencer)
                    };
                });

                console.log("Dados convertidos:", estoque);
                atualizarTabela();
            };
            reader.readAsArrayBuffer(file);
        } else {
            alert("Nenhum arquivo selecionado.");
        }
    };

    // Função para salvar dados manuais
    window.salvarDadosManuais = function () {
        if (estoque.length === 0) {
            alert("Nenhum dado manual foi inserido.");
            return;
        }

        const worksheet = XLSX.utils.json_to_sheet(estoque);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Estoque");
        XLSX.writeFile(workbook, "estoque_manual.xlsx");
    };

    // Função para limpar dados
    window.limparDados = function () {
        if (confirm("Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita.")) {
            estoque = [];
            localStorage.removeItem("estoque");
            atualizarTabela();
        }
    };

    // Atualiza a tabela ao carregar a página
    atualizarTabela();
});