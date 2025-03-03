Documentação: Gestor de Validade em Estoque
Este documento explica passo a passo como utilizar o Gestor de Validade em Estoque, uma aplicação web que permite gerenciar produtos em estoque, incluindo a adição, edição, remoção e visualização de itens com base em suas datas de validade.

1. Estrutura do Projeto
O projeto é composto por três arquivos principais:

index.html: Contém a estrutura da página web.

main.css: Define o estilo visual da aplicação.

main.js: Implementa a lógica de funcionamento da aplicação.

2. Funcionalidades Principais
A aplicação oferece as seguintes funcionalidades:

Adicionar itens manualmente: Permite inserir novos produtos no estoque.

Editar itens: Permite modificar os dados de um produto existente.

Remover itens: Remove um produto do estoque.

Importar dados de uma planilha: Carrega dados de um arquivo Excel (.xlsx ou .xls).

Salvar dados manualmente: Exporta os dados do estoque para um arquivo Excel.

Salvar na mesma base de dados: Atualiza o arquivo Excel importado com os dados atuais.

Limpar dados: Remove todos os itens do estoque.

3. Passo a Passo para Utilização
3.1. Adicionar Itens Manualmente
Clique no botão "Adicionar Manualmente".

Preencha os campos do formulário:

Código: Código do produto.

Produto: Nome do produto.

Quantidade: Quantidade em estoque.

Data de Validade: Data de validade do produto.

Clique em "Adicionar" para salvar o item ou "Cancelar" para fechar o formulário sem salvar.

3.2. Editar Itens
Na tabela de estoque, localize o item que deseja editar.

Clique no botão "Editar" ao lado do item.

No modal que abrir, modifique os campos desejados:

Código, Produto, Quantidade, Data de Validade.

Clique em "Salvar" para confirmar as alterações ou "Cancelar" para descartá-las.

3.3. Remover Itens
Na tabela de estoque, localize o item que deseja remover.

Clique no botão "Remover" ao lado do item.

Confirme a remoção no alerta que aparecer.

3.4. Importar Dados de uma Planilha
Clique no botão "Escolher Arquivo" e selecione um arquivo Excel (.xlsx ou .xls).

Clique no botão "Importar Planilha".

Os dados da planilha serão carregados na tabela de estoque.

3.5. Salvar Dados Manualmente
Clique no botão "Salvar Dados Manuais".

Um arquivo Excel chamado estoque_manual.xlsx será baixado com os dados atuais do estoque.

3.6. Salvar na Mesma Base de Dados
Importe uma planilha (se ainda não o fez).

Clique no botão "Salvar Base de Dados".

O arquivo Excel original será atualizado com os dados atuais do estoque e será baixado automaticamente.

3.7. Limpar Dados
Clique no botão "Limpar Dados".

Confirme a ação no alerta que aparecer.

Todos os itens do estoque serão removidos.

4. Estrutura da Tabela de Estoque
A tabela exibe as seguintes colunas:

Código: Código do produto.

Produto: Nome do produto.

Quantidade: Quantidade em estoque.

Data de Validade: Data de validade do produto.

Dias para Vencer: Quantidade de dias restantes até a data de validade.

Situação: Estado do produto com base na data de validade (ex: "Dentro da validade", "Vencido").

Editar: Botão para editar o item.

Remover: Botão para remover o item.

5. Códigos de Situação e Cores
A situação do produto é determinada com base nos dias restantes para a data de validade:

Vencido: Produto já venceu (cor laranja).

Vence hoje: Produto vence no dia atual (cor vermelha).

Prazo estourado: Produto vence em até 10 dias (cor rosa).

Dentro da validade: Produto está dentro do prazo (cor verde).

6. Como Funciona o Código
6.1. Armazenamento de Dados
Os dados do estoque são armazenados no localStorage do navegador, permitindo que as informações persistam mesmo após o recarregamento da página.

6.2. Atualização da Tabela
A função atualizarTabela() é responsável por preencher a tabela com os dados do estoque e aplicar as cores de situação.

6.3. Cálculo de Dias para Vencer
A função calcularDiasParaVencer() calcula a diferença entre a data de validade e a data atual.

6.4. Importação e Exportação de Dados
A biblioteca XLSX é utilizada para ler e escrever arquivos Excel.

7. Requisitos para Execução
Navegador moderno (Chrome, Firefox, Edge, etc.).

Conexão com a internet (para carregar a biblioteca XLSX).

8. Exemplo de Uso
Abra o arquivo index.html no navegador.

Adicione alguns itens manualmente ou importe uma planilha.

Edite ou remova itens conforme necessário.

Exporte os dados para um arquivo Excel ou atualize a planilha original.

9. Dicas
Certifique-se de que as datas de validade estejam no formato AAAA-MM-DD ao importar uma planilha.

Utilize o botão "Limpar Dados" com cuidado, pois a ação não pode ser desfeita.

10. Conclusão
O Gestor de Validade em Estoque é uma ferramenta simples e eficaz para gerenciar produtos com base em suas datas de validade. Com funcionalidades de adição, edição, remoção e importação/exportação de dados, ele é ideal para pequenos negócios ou uso pessoal.

Se tiver dúvidas ou problemas, consulte o código-fonte ou entre em contato com o desenvolvedor. 😊