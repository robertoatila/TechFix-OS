# Roteiro de apresentação — TechFix OS

## Roberto

Nosso projeto se chama **TechFix OS**. Ele foi criado para ajudar pequenas assistências técnicas a organizar ordens de serviço de celulares e computadores.

O aplicativo permite cadastrar o modelo do aparelho, o defeito relatado, o custo da peça, o valor da mão de obra e o status do reparo.

Uma das regras de negócio é o cálculo automático do valor total da OS:

```text
Total = custo da peça + mão de obra
```

Por exemplo, uma peça de R$ 450,00 com mão de obra de R$ 150,00 gera um total de R$ 600,00.

## Vinicius

Os dados ficam armazenados no **Supabase**, que funciona como banco de dados do projeto.

O aplicativo implementa as quatro operações de CRUD:

- **Create:** cadastrar uma nova OS;
- **Read:** listar as ordens cadastradas;
- **Update:** editar dados e status;
- **Delete:** excluir uma OS após confirmação.

Também bloqueamos valores negativos e usamos cores para facilitar a leitura dos status:

- amarelo: Em Análise;
- laranja: Aguardando Peça;
- verde: Concluído.

O dashboard mostra quantas ordens existem, quantas estão em andamento e quantas foram concluídas.

## Decisão criativa

A principal decisão criativa é o **sistema visual de acompanhamento das Ordens de Serviço**, combinando cores de status com o dashboard de resumo.
