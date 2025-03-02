Sistema de Gerenciamento de Estoque
Este é um sistema web para gerenciamento de estoque, desenvolvido para ajudar pequenos negócios a controlar produtos, validades e situações de estoque de forma simples e eficiente.

Funcionalidades
Cadastro de Produtos:

Adicionar produtos manualmente com código, nome, quantidade e data de validade.

Atualizar ou remover produtos existentes.

Importação de Dados:

Importar dados de uma planilha Excel (formato .xlsx ou .xls).

Os dados são convertidos e exibidos na tabela de estoque.

Cálculo Automático:

Calcula os dias restantes para a validade de cada produto.

Define a situação do produto com base nos dias para vencer:

Vencido: Dias para vencer < 0.

Vence hoje: Dias para vencer = 0.

Prazo estourado: Dias para vencer <= 10.

Dentro da validade: Dias para vencer > 10.

Interface Responsiva:

Funciona em dispositivos móveis e desktops.

Design simples e intuitivo.

Persistência de Dados:

Os dados são salvos no localStorage do navegador, permitindo que as informações sejam mantidas mesmo após o fechamento da página.

Exportação de Dados:

Exportar os dados manuais para um arquivo Excel (.xlsx).

Tecnologias Utilizadas
Frontend:

HTML5

CSS3

JavaScript (Vanilla JS)

Bibliotecas:

SheetJS (xlsx): Para manipulação de arquivos Excel.

Hospedagem:

Vercel: Para deploy do projeto.

Como Usar
1. Executando Localmente
Clone o repositório:

bash
Copy
git clone https://github.com/seu-usuario/sistema-estoque.git
cd sistema-estoque
Abra o projeto:

Abra o arquivo index.html no navegador.

Usando o Sistema:

Adicione produtos manualmente ou importe uma planilha Excel.

Os dados serão exibidos na tabela e salvos automaticamente no localStorage.

2. Fazendo Deploy no Vercel
Instale o Vercel CLI:

bash
Copy
npm install -g vercel
Faça login na Vercel:

bash
Copy
vercel login
Implante o projeto:

bash
Copy
vercel
Acesse o link gerado:

Após o deploy, o Vercel fornecerá um link para acessar o sistema online.

Estrutura do Projeto
Copy
sistema-estoque/
│
├── index.html          # Página principal do sistema
├── main.css            # Estilos CSS
├── main.js             # Lógica principal do sistema
├── README.md           # Documentação do projeto
└── assets/             # Pasta para arquivos estáticos (opcional)
Como Funciona o Código
1. Importação de Dados
O sistema usa a biblioteca SheetJS para ler arquivos Excel.

Os dados são convertidos em um array de objetos e exibidos na tabela.

javascript
Copy
function importarDados() {
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

            // Processar os dados...
        };
        reader.readAsArrayBuffer(file);
    }
}
2. Cálculo de Dias para Vencer
A função calcularDiasParaVencer calcula a diferença entre a data de validade e a data atual.

javascript
Copy
function calcularDiasParaVencer(dataValidade) {
    const hoje = new Date();
    const diffTime = dataValidade - hoje;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
3. Persistência de Dados
Os dados são salvos no localStorage e recuperados ao carregar a página.

javascript
Copy
function salvarNoLocalStorage() {
    localStorage.setItem("estoque", JSON.stringify(estoque));
}

function carregarDoLocalStorage() {
    estoque = JSON.parse(localStorage.getItem("estoque")) || [];
}
Personalização
1. Adicionar Novas Funcionalidades
Autenticação de Usuários: Adicione um sistema de login para proteger o acesso.

Relatórios em PDF: Use bibliotecas como jsPDF para gerar relatórios.

Notificações: Envie alertas por e-mail ou WhatsApp quando produtos estiverem perto de vencer.

2. Alterar Cores e Estilos
Edite o arquivo main.css para personalizar o design do sistema.

css
Copy
/* Exemplo de personalização */
body {
    background-color: #f0f0f0;
    font-family: 'Arial', sans-serif;
}

.botoes button {
    background-color: #007bff;
    color: #fff;
    border-radius: 5px;
}
Limitações
Persistência Local:

Os dados são salvos apenas no navegador do usuário. Se ele limpar o cache ou trocar de dispositivo, os dados serão perdidos.

Solução: Implementar um backend para armazenar os dados em um banco de dados.

Segurança:

O sistema não possui autenticação, então qualquer pessoa com acesso ao link pode editar os dados.

Solução: Adicionar um sistema de login.

Escalabilidade:

O sistema foi projetado para pequenos estoques. Para grandes volumes de dados, pode ser necessário otimizar o código.

Contribuição
Se você quiser contribuir para o projeto, siga os passos abaixo:

Faça um fork do repositório.

Crie uma branch para sua feature:

bash
Copy
git checkout -b minha-feature
Commit suas alterações:

bash
Copy
git commit -m "Adicionando nova funcionalidade"
Envie para o repositório remoto:

bash
Copy
git push origin minha-feature
Abra um pull request.

Licença
Este projeto está licenciado sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

Contato
Se tiver dúvidas ou sugestões, entre em contato:

Nome: [Seu Nome]

E-mail: [seu-email@exemplo.com]

GitHub: [https://github.com/seu-usuario]