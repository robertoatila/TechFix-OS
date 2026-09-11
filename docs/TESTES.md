# Testes para a apresentação

## 1. Cadastro

Cadastre:

```text
Modelo: iPhone 13
Defeito: Tela quebrada
Custo da peça: 450
Mão de obra: 150
Status: Em Análise
```

Resultado esperado:

```text
Total: R$ 600,00
```

A OS deve aparecer na lista e também na tabela `ordens_servico` do Supabase.

## 2. Edição de status

Edite a OS e altere para:

```text
Aguardando Peça
```

Resultado esperado: card com status laranja.

## 3. Edição de valores

Altere:

```text
Custo da peça: 500
Mão de obra: 150
```

Resultado esperado:

```text
Total: R$ 650,00
```

## 4. Valor negativo

Tente cadastrar:

```text
Custo da peça: -50
```

Resultado esperado:

```text
Os valores não podem ser negativos.
```

A OS não deve ser cadastrada.

## 5. Exclusão

Exclua uma OS e confirme.

Resultado esperado: o registro desaparece da lista e da tabela no Supabase.
