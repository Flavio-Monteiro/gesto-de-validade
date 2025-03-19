document.addEventListener("DOMContentLoaded", function () {
    console.log("Página carregada. Carregando dados do localStorage...");
    const estoqueTable = document.getElementById("estoqueTable").getElementsByTagName('tbody')[0];
    const formularioAdicionar = document.getElementById("formularioAdicionar");
    const formAdicionar = document.getElementById("formAdicionar");
    const modalEditar = document.getElementById("modalEditar");
    const formEditar = document.getElementById("formEditar");

    let estoque = (JSON.parse(localStorage.getItem("estoque")) || []).map(item => {
        return {
            ...item,
            dataValidade: new Date(item.dataValidade) // Convertendo a string de volta para Date
        };
    });
    
    let itemEditando = null;

    // Função para atualizar as datas e situações
    window.atualizarDatas = function () {
        estoque.forEach(item => {
            if (item.dataValidade) {
                const dataValidade = new Date(item.dataValidade);
                item.diasParaVencer = calcularDiasParaVencer(dataValidade);
                item.situacao = calcularSituacao(item.diasParaVencer);
            }
        });
        atualizarTabela();
        alert("Datas e situações atualizadas com sucesso!");
    };

    // Função para mostrar o formulário de adição
    window.mostrarFormulario = function () {
        formularioAdicionar.style.display = "block";
    };

    // Função para ocultar o formulário de adição
    window.ocultarFormulario = function () {
        formularioAdicionar.style.display = "none";
        formAdicionar.reset();
    };

    // Função para mostrar o modal de edição
    window.mostrarModalEditar = function (index) {
        itemEditando = index;
        const item = estoque[index];
        document.getElementById("editarCodigo").value = item.codigo;
        document.getElementById("editarProduto").value = item.produto;
        document.getElementById("editarQuantidade").value = item.quantidade;
        document.getElementById("editarDataValidade").value = item.dataValidade.toISOString().split('T')[0];
        modalEditar.style.display = "block";
    };

    // Função para ocultar o modal de edição
    window.ocultarModalEditar = function () {
        modalEditar.style.display = "none";
        formEditar.reset();
        itemEditando = null;
    };

    // Função para adicionar item manualmente
    formAdicionar.addEventListener("submit", function (event) {
        event.preventDefault();

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
            ocultarFormulario();
        } else {
            alert("Por favor, preencha todos os campos corretamente.");
        }
    });

    // Função para editar item
    formEditar.addEventListener("submit", function (event) {
        event.preventDefault();

        const codigo = document.getElementById("editarCodigo").value;
        const produto = document.getElementById("editarProduto").value;
        const quantidade = parseInt(document.getElementById("editarQuantidade").value);
        const dataValidade = new Date(document.getElementById("editarDataValidade").value);

        if (codigo && produto && !isNaN(quantidade) && dataValidade instanceof Date && !isNaN(dataValidade)) {
            const diasParaVencer = calcularDiasParaVencer(dataValidade);

            estoque[itemEditando] = {
                codigo,
                produto,
                quantidade,
                dataValidade,
                diasParaVencer,
                situacao: calcularSituacao(diasParaVencer)
            };

            atualizarTabela();
            ocultarModalEditar();
        } else {
            alert("Por favor, preencha todos os campos corretamente.");
        }
    });

    // Função para atualizar a tabela
    function atualizarTabela() {
        console.log("Atualizando tabela...");
        estoqueTable.innerHTML = "";
        estoque.forEach((item, index) => {
            const row = estoqueTable.insertRow();
            row.insertCell(0).textContent = item.codigo;
            row.insertCell(1).textContent = item.produto;
            row.insertCell(2).textContent = item.quantidade;

            const dataValidade = item.dataValidade instanceof Date ? item.dataValidade : new Date(item.dataValidade);
            row.insertCell(3).textContent = dataValidade ? dataValidade.toISOString().split('T')[0] : "N/A";

            row.insertCell(4).textContent = item.diasParaVencer !== null ? item.diasParaVencer : "N/A";

            const situacaoCell = row.insertCell(5);
            situacaoCell.textContent = item.situacao;
            situacaoCell.className = item.situacao.replace(/ /g, "-");
            situacaoCell.style.backgroundColor = getCorSituacao(item.situacao);

            const editarCell = row.insertCell(6);
            const editarBtn = document.createElement("button");
            editarBtn.textContent = "Editar";
            editarBtn.addEventListener("click", () => mostrarModalEditar(index));
            editarCell.appendChild(editarBtn);

            const removerCell = row.insertCell(7);
            const removerBtn = document.createElement("button");
            removerBtn.textContent = "Remover";
            removerBtn.classList.add("btn-remover");
            removerBtn.addEventListener("click", () => removerItem(index));
            removerCell.appendChild(removerBtn);
        });

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
            case "Vencido": return "#EC8305";
            case "Vence hoje": return "#FF8343";
            case "Prazo estourado": return "#E78F81";
            case "Dentro da validade": return "#86D293";
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

                estoque = json.slice(1).map(row => {
                    let dataValidade;

                    if (typeof row[3] === 'number') {
                        const excelEpoch = new Date(1900, 0, 1);
                        dataValidade = new Date(excelEpoch.getTime() + (row[3] - 1) * 86400 * 1000);
                    } else if (typeof row[3] === 'string') {
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

    // Função para salvar na mesma base de dados
    window.salvarBaseDados = function () {
        const fileInput = document.getElementById("fileInput");
        const file = fileInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];

                XLSX.utils.sheet_add_aoa(worksheet, [], { origin: 1 });

                const novosDados = estoque.map(item => [
                    item.codigo,
                    item.produto,
                    item.quantidade,
                    item.dataValidade.toISOString().split('T')[0],
                    item.diasParaVencer,
                    item.situacao
                ]);
                XLSX.utils.sheet_add_aoa(worksheet, novosDados, { origin: 1 });

                const novoArquivo = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });
                const blob = new Blob([novoArquivo], { type: 'application/octet-stream' });
                const link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                link.download = file.name;
                link.click();
                console.log("Base de dados salva com sucesso!");
            };
            reader.readAsArrayBuffer(file);
        } else {
            alert("Nenhum arquivo selecionado. Importe uma planilha primeiro.");
        }
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