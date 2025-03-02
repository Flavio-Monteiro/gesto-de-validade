document.addEventListener("DOMContentLoaded", function() {
    console.log("Página carregada. Carregando dados do localStorage..."); // Debug
    const estoqueTable = document.getElementById("estoqueTable").getElementsByTagName('tbody')[0];
    let estoque = JSON.parse(localStorage.getItem("estoque")) || [];
    console.log("Dados carregados:", estoque); // Debug

    // Função para atualizar a tabela
    function atualizarTabela() {
        console.log("Atualizando tabela..."); // Debug
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
        console.log("Tabela atualizada e dados salvos no localStorage."); // Debug
    }

    // Função para salvar dados inseridos manualmente em um arquivo XLS
    function salvarDadosManuais() {
        if (estoque.length === 0) {
            alert("Nenhum dado manual foi inserido.");
            return;
        }

        // Cria uma nova planilha
        const worksheet = XLSX.utils.json_to_sheet(estoque);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Estoque");

        // Salva o arquivo
        XLSX.writeFile(workbook, "estoque_manual.xlsx");
        console.log("Dados manuais salvos em estoque_manual.xlsx"); // Debug
    }

    // Função para remover um item
    function removerItem(index) {
        if (confirm("Tem certeza que deseja remover este produto?")) {
            console.log("Removendo item:", estoque[index]); // Debug
            estoque.splice(index, 1); // Remove o item do array
            atualizarTabela(); // Atualiza a tabela
        }
    }

    // Função para obter a cor da situação
    function getCorSituacao(situacao) {
        switch (situacao) {
            case "Vencido":
                return "#ffcccc"; // Vermelho claro
            case "Vence hoje":
                return "#ffebcc"; // Laranja claro
            case "Prazo estourado":
                return "#fff3cc"; // Amarelo claro
            case "No prazo para retirada":
                return "#ccffcc"; // Verde claro
            case "Dentro da validade":
                return "#ccf2ff"; // Azul claro
            default:
                return "#ffffff"; // Branco
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
            const hoje = new Date();
            const diffTime = novaDataValidadeObj - hoje;
            const diasParaVencer = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

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

    // Função para salvar na mesma base de dados
    function salvarBaseDados() {
        const fileInput = document.getElementById("fileInput");
        const file = fileInput.files[0];
        if (file) {
            console.log("Salvando base de dados..."); // Debug
            const reader = new FileReader();
            reader.onload = function(e) {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];

                // Atualiza a planilha com os dados do estoque
                const novosDados = estoque.map(item => [
                    item.codigo,
                    item.produto,
                    item.quantidade,
                    item.dataValidade.toISOString().split('T')[0],
                    item.diasParaVencer,
                    item.situacao
                ]);
                XLSX.utils.sheet_add_aoa(worksheet, novosDados, { origin: 1 }); // Adiciona os dados a partir da segunda linha

                // Salva o arquivo atualizado
                const novoArquivo = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });
                const blob = new Blob([novoArquivo], { type: 'application/octet-stream' });
                const link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                link.download = file.name;
                link.click();
                console.log("Base de dados salva com sucesso!"); // Debug
            };
            reader.readAsArrayBuffer(file);
        } else {
            console.log("Nenhum arquivo selecionado."); // Debug
            alert("Nenhum arquivo selecionado. Importe uma planilha primeiro.");
        }
    }

    // Função para calcular a situação
    function calcularSituacao(diasParaVencer) {
        if (diasParaVencer === null || isNaN(diasParaVencer)) {
            return "Data inválida";
        } else if (diasParaVencer < 0) {
            return "Vencido";
        } else if (diasParaVencer === 0) {
            return "Vence hoje";
        } else if (diasParaVencer === 10) {
            return "No prazo para retirada";
        } else if (diasParaVencer < 10) {
            return "Prazo estourado";
        } else {
            return "Dentro da validade";
        }
    }

    // Função para importar dados
    function importarDados() {
        const fileInput = document.getElementById("fileInput");
        const file = fileInput.files[0];
        if (file) {
            console.log("Importando planilha..."); // Debug
            const reader = new FileReader();
            reader.onload = function(e) {
                console.log("Arquivo carregado com sucesso!"); // Debug
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

                console.log("Dados da planilha:", json); // Debug

                // Converter os dados para o formato esperado
                estoque = json.slice(1).map(row => {
                    let dataValidade;
                    if (typeof row[3] === 'number') {
                        // Converter data do Excel (número de dias desde 1900-01-01) para objeto Date
                        dataValidade = new Date((row[3] - 25569) * 86400 * 1000);
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
                        dataValidade: dataValidade,
                        diasParaVencer: diasParaVencer,
                        situacao: calcularSituacao(diasParaVencer)
                    };
                });

                console.log("Dados convertidos:", estoque); // Debug
                atualizarTabela();
            };
            reader.readAsArrayBuffer(file);
        } else {
            console.log("Nenhum arquivo selecionado."); // Debug
            alert("Nenhum arquivo selecionado. Importe uma planilha primeiro.");
        }
    }

    // Função para adicionar manualmente
    function adicionarManual() {
        const codigo = prompt("Digite o código do produto:");
        const produto = prompt("Digite o nome do produto:");
        const quantidade = prompt("Digite a quantidade:");
        const dataValidade = prompt("Digite a data de validade (AAAA-MM-DD):");

        if (codigo && produto && quantidade && dataValidade) {
            const dataValidadeObj = new Date(dataValidade);
            const hoje = new Date();
            const diffTime = dataValidadeObj - hoje;
            const diasParaVencer = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            estoque.push({
                codigo,
                produto,
                quantidade,
                dataValidade: dataValidadeObj,
                diasParaVencer,
                situacao: calcularSituacao(diasParaVencer)
            });

            console.log("Item adicionado manualmente:", estoque[estoque.length - 1]); // Debug
            atualizarTabela();
        }
    }

    // Função para limpar dados
    function limparDados() {
        if (confirm("Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita.")) {
            console.log("Limpando dados..."); // Debug
            estoque = []; // Limpa o array de estoque
            localStorage.removeItem("estoque"); // Remove os dados do localStorage
            console.log("Dados limpos:", localStorage.getItem("estoque")); // Debug
            atualizarTabela(); // Atualiza a tabela para refletir a limpeza
        }
    }

    // Atualiza a tabela ao carregar a página
    atualizarTabela();

    // Expõe as funções para o escopo global (para serem chamadas no HTML)
    window.importarDados = importarDados;
    window.adicionarManual = adicionarManual;
    window.salvarBaseDados = salvarBaseDados;
    window.salvarDadosManuais = salvarDadosManuais;
    window.limparDados = limparDados;
});