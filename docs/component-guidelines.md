# Diretrizes para Criação de Componentes

## Alinhamento com Arquitetura
- Este documento não define organização de pastas ou local de criação.
- Para decisões de estrutura e escopo por rota/feature, siga exclusivamente `docs/architecture-guidelines.md`.

## Estrutura de Arquivos
- Arquivos relacionados ao componente:
  - `Componente.tsx`: implementação principal.
  - `Componente.module.css`: estilos específicos.
  - `Componente.test.tsx`: testes (quando stack de testes estiver configurado no projeto).

## Padrões de Nomenclatura
- Use **PascalCase** para nomes de componentes.
- Exemplo: `Header.tsx`, `Footer.tsx`.

## Boas Práticas
- Componentes devem ser pequenos e reutilizáveis.
- Evite lógica complexa dentro de componentes. Use hooks ou serviços da feature.
- Utilize `TypeScript` para tipagem de propriedades.
- Todo componente novo deve ser pensado em **mobile-first**: implemente primeiro o layout para telas pequenas e depois evolua para breakpoints maiores.
- Quando houver necessidade de comportamento responsivo em JavaScript (além de CSS), utilize preferencialmente os hooks locais `src/hooks/useBreakpoint.ts`.
- **Não adicione props como `className` ou qualquer prop relacionada à alteração de layout externa**. O componente não deve aceitar `className` nem permitir mudanças de layout externas, exceto por props controladas como `theme`, `size` ou similares, que devem ser explicitamente definidas e documentadas.
- Mudanças de layout e estilos devem ser controladas internamente pelo componente, considerando apenas as props específicas (`theme`, `size`, etc.) e nunca via props genéricas como `className`.

## Regras Adicionais para Componentes
- **Exportação de Componentes**: Sempre utilize `export function Component(...)` para exportar componentes.
- **Exceção para Rotas em `pages/`**: arquivos de rota podem usar `export default function` quando exigido pelo roteamento baseado em arquivo.
- **Importação do React**: Não é necessário importar o React explicitamente.
- **Importação de Estilos**: Sempre importe os estilos do componente utilizando a variável `s`.
  ```tsx
  import s from './Component.module.css'
  ```
- **Tipagem**: Continue utilizando `TypeScript` para definir os tipos de propriedades e garantir segurança de tipos
- **Proibição de `className`**: Não adicione a prop `className` (ou similares como `style`, `containerClass`, etc.) nos componentes. O controle de classes deve ser feito apenas internamente.
- **Condições em className**: Sempre que precisar de lógica condicional para classes CSS, utilize o pacote [`classnames`](https://www.npmjs.com/package/classnames) com o import padrão `cn`:
  ```tsx
  import cn from 'classnames'
  ```
  Use `cn` para compor classes dinamicamente, por exemplo:
  ```tsx
  <div className={cn(s.root, { [s.active]: isActive })} />
  ```
- **Responsividade e Breakpoints**: priorize ajustes responsivos por CSS (`@media`) com abordagem mobile-first. Quando a regra depender de lógica de renderização/comportamento, prefira:
  ```tsx
  import { useBreakpoint } from '@/src/hooks/useMobileBreakpoint'

  const { isTablet } = useBreakpoint()

  if (isTablet) {
    // comportamento para tablet e maiores
  }
  ```

## Exemplo de Componente
```tsx
import s from './Header.module.css'
import cn from 'classnames'

type HeaderProps = {
  title: string;
  theme?: 'light' | 'dark';
}

export function Header({ title, theme = 'light' }: HeaderProps) {
  return (
    <header className={cn(s.header, s[theme])}>
      <h1>{title}</h1>
    </header>
  )
}
```

## Testes
- Escreva testes unitários para cada componente.
- Utilize o stack de testes já adotado no projeto.
- Se o stack de testes ainda não estiver configurado, priorize estruturar o componente para testabilidade (props claras, lógica em hooks e baixa dependência de estado global).

## Estilos
- Utilize CSS Modules para escopo de estilos.

### Uso obrigatorio do padrao de variaveis CSS em componentes novos
- Todo componente novo deve utilizar obrigatoriamente o padrao estabelecido em `src/styles/base/variables.css`.
- Nao use valores hardcoded de cor, fonte, espacamento ou breakpoints em `.module.css` quando houver variavel global correspondente.
- Em caso de ausencia de variavel adequada, adicione primeiro em `variables.css` seguindo o padrao de nomenclatura existente e, depois, use `var(--nome-da-variavel)` no componente.

### Variáveis de Cores
- **Todas as cores devem ser globais** em `src/styles/base/variables.css`.
- **Nunca** defina variáveis de cor dentro de arquivos `.module.css`.
- Antes de adicionar uma nova cor, verifique se já existe uma variável similar no arquivo.
- Nomeie as variáveis com base na cor hexadecimal que representam.

#### Regras de Nomenclatura
- Use **somente nomes de cores reais** como nome de variável. Não use nomes funcionais como `--primary`, `--secondary`, `--success`, `--error`, `--text-primary`, etc.
- Use nomes descritivos baseados na cor: `--red`, `--blue`, `--green`, `--black`, `--white`, `--gray-100`, `--gray-500`, `--gray-900`, etc.
- Para transparências, use o padrão `--{cor}-{opacidade}`: `--black-05`, `--white-50`, etc.

#### Nomenclatura Correta vs Incorreta
```css
/* ✅ Correto - nomes baseados na cor */
:root {
  --gray: #xxxxxx;
  --gray-100: #xxxxxx;
  --gray-500: #xxxxxx;
  --gray-900: #xxxxxx;
  --black-05: rgba(0, 0, 0, 0.05);
}

/* ❌ Incorreto - nomes funcionais */
:root {
  --primary: #xxxxxx;        /* Use --blue */
  --secondary: #xxxxxx;      /* Use --gray */
  --success: #xxxxxx;        /* Use --green */
  --error: #xxxxxx;          /* Use --red */
  --text-primary: #xxxxxx;   /* Use --gray-900 */
  --text-secondary: #xxxxxx; /* Use --gray-600 */
}
```

#### Fluxo de Decisão para Cores
1. **Verifique** se a cor já existe em `src/styles/base/variables.css`
2. **Se existir**, use a variável global
3. **Se não existir**, adicione a nova cor em `variables.css` com nome baseado na cor
4. **Nunca use valores hexadecimais diretos** nos componentes; use `var(--nome-da-variavel)`
5. **Nunca repita cores hexadecimais** em múltiplos arquivos CSS

#### Exemplos
```css
/* variables.css */
:root {
  --red: #ff0000;
}

/* Component.module.css - ✅ Correto */
.container {
  background: var(--red);
}

/* Component.module.css - ❌ Incorreto */
.container {
  --local-color: #ff0000;
  background: var(--local-color);
}
```

### Variáveis de Fontes
- O arquivo `src/styles/base/fonts.css` deve conter apenas declarações `@font-face`.
- Toda variável CSS de tipografia (família, pesos, etc.) deve ser definida em `src/styles/base/variables.css`.
- Antes de adicionar uma nova variável de fonte, verifique se já existe uma similar em `variables.css`.
- Use nomenclatura consistente seguindo o padrão existente, por exemplo: `--font-nome-da-fonte`.
- Nos arquivos CSS dos componentes, use `var(--font-nome-da-fonte)` em vez de valores diretos.