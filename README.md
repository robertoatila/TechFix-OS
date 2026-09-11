# TechFix OS

Aplicativo acadêmico de **gestão de Ordens de Serviço** para assistência técnica de celulares e informática, desenvolvido por **Roberto e Vinicius**.

O projeto foi pensado para rodar de forma simples no **Expo Snack**, usando **React Native + JavaScript + Supabase**.

## Funcionalidades

- cadastro de ordens de serviço;
- listagem em cards;
- edição por modal;
- exclusão com confirmação;
- cálculo automático de peça + mão de obra;
- bloqueio de valores negativos;
- três status visuais;
- dashboard com total, andamento e concluídas;
- pesquisa por aparelho ou defeito;
- persistência real no Supabase.

## Estrutura

```text
TechFix-OS/
├── App.js
├── README.md
├── snack-dependencies.json
├── supabase/
│   └── schema.sql
└── docs/
    ├── PROMPT.md
    ├── APRESENTACAO.md
    └── TESTES.md
```

## Supabase

Abra o **SQL Editor** do projeto Supabase e execute:

```text
supabase/schema.sql
```

A tabela criada é:

```text
ordens_servico
```

Campos:

```text
id
modelo_aparelho
defeito_relatado
custo_peca
valor_mao_de_obra
status_os
created_at
```

O projeto é uma demonstração escolar, portanto o SQL deixa o acesso público propositalmente simples para funcionar diretamente pelo Snack.

## Expo Snack

Crie um Snack e adicione as dependências descritas em `snack-dependencies.json`.

Depois copie `App.js` para o editor do Snack.

O `App.js` já está configurado para o projeto Supabase usado durante o desenvolvimento escolar.

## Regra de negócio

```text
TOTAL = CUSTO DA PEÇA + MÃO DE OBRA
```

Valores negativos são bloqueados no aplicativo e também pelo banco.

## Status

```text
Em Análise       → amarelo
Aguardando Peça  → laranja
Concluído        → verde
```

## CRUD

| Operação | Implementação |
|---|---|
| Create | Cadastro de nova OS |
| Read | Listagem das OS |
| Update | Modal de edição |
| Delete | Exclusão com confirmação |

## Teste rápido

Cadastre:

```text
Modelo: iPhone 13
Defeito: Tela quebrada
Peça: 450
Mão de obra: 150
```

Resultado esperado:

```text
R$ 600,00
```

O roteiro completo está em [`docs/TESTES.md`](docs/TESTES.md).

## Apresentação

O roteiro para Roberto e Vinicius está em [`docs/APRESENTACAO.md`](docs/APRESENTACAO.md).
