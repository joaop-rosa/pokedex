# Diretrizes para Arquitetura

## Princípio Transversal
- Sempre considere escopo local primeiro.
- Promova para escopo global apenas quando houver necessidade real de compartilhamento entre múltiplas rotas/features.
- Em caso de dúvida, mantenha local.

## Estrutura orientada a rotas e features
- O projeto usa Vite + React com roteamento baseado em arquivos de `pages/`.
- Cada rota deve ser tratada como uma feature.
- Organize o código por página primeiro e, dentro da página, por responsabilidade.

### Regras para `pages/`
- Arquivo da rota: mantenha no nível de `pages/` quando a tela for simples.
- Pasta da rota: crie somente quando houver código específico da página além do arquivo principal.
- Ao criar pasta da rota, use subpastas internas com prefixo `_` para sinalizar escopo local da página.
- Em rotas baseadas em arquivo, use `export default function` no arquivo da rota quando o roteador exigir.

### Convenção recomendada
- `pages/nome-da-rota.tsx`:
  - Use para páginas simples, sem componentes/hooks/contexts exclusivos.
- `pages/nome-da-rota/`:
  - Use quando a rota tiver estrutura própria.
  - Estrutura interna sugerida:
    - `_components/` (se necessário)
    - `_hooks/` (se necessário)
    - `_contexts/` (se necessário)
    - `_modals/` (se necessário)
    - `index.tsx` (entrada da rota)

### Convenção para Modais
- Use `src/modals/` para modais reutilizáveis entre múltiplas páginas.
- Em features de página, use `pages/nome-da-rota/_modals/` para modais exclusivos daquela rota.
- Modais locais devem ser registrados em um `DialogProvider` no `_layout` da própria página/feature.
- Ao usar `_modals/`, crie `pages/nome-da-rota/_layout.tsx` para encapsular o provider e manter o escopo local.
- Promova um modal de `_modals/` para `src/modals/` apenas quando houver reuso real em mais de uma página.

## Boas Práticas de Arquitetura
- Separe lógica de apresentação e lógica de negócios.
- Utilize `contexts/` globais apenas para estado realmente compartilhado entre múltiplas rotas.
- Prefira hooks para encapsular lógica reutilizável.
- Mantenha o que é específico da rota dentro da própria pasta da rota.
- Promova para `components/`, `hooks/` ou `contexts/` globais apenas o que for reutilizado por mais de uma página.

## Organização por escopo
- `pages/`: definição de rotas e features por tela.
- `components/`: componentes reutilizáveis entre páginas.
- `modals/`: modais reutilizáveis entre páginas.
- `hooks/`: hooks reutilizáveis entre páginas.
- `contexts/`: providers e contextos globais.
- `infra/`: API, clientes HTTP, cookies, tratamento de erro e integrações externas.

## Diretrizes de roteamento
- Mantenha a lógica de composição de rotas no nível de `router.ts`.
- Evite concentrar regra de negócio em `router.ts`; a regra deve ficar na feature da página.
- Para rotas com modais, estados locais e fluxos próprios, prefira pasta dedicada em `pages/`.

### Navegação interna
- **Sempre** utilize `Link` ou `useNavigate` do React Router para navegação interna.
- **Nunca** use `<a href="...">` para links internos; isso causa reload completo da página.
- Importe `Link` e `useNavigate` de `@/src/router`.

#### Exceções (quando `<a href>` é permitido)
- Links para **domínios externos** (ex: `https://example.com`).
- Links para **downloads de arquivos** (ex: PDFs, imagens).
- Links que precisam abrir em **nova aba** (`target="_blank"`) com `rel="noopener noreferrer"`.
- Arquivos estáticos servidos pelo servidor (raro em SPA com Vite).

#### Exemplos

```tsx
// ✅ Correto - navegação interna com Link
import { Link } from '@/src/router'

<Link to="/dashboard">Dashboard</Link>

// ✅ Correto - navegação programática com useNavigate
import { useNavigate } from '@/src/router'

const navigate = useNavigate()
navigate('/settings')

// ❌ Incorreto - navegação interna com <a href>
<a href="/dashboard">Dashboard</a>

// ✅ Correto - link externo
<a href="https://google.com" target="_blank" rel="noopener noreferrer">Google</a>
```

### Sobre router.ts e tipos de rota
- O arquivo `router.ts` é automaticamente gerado pelo plugin `generouted` com base nos arquivos em `pages/`.
- Os tipos de rota (`Path`) são atualizados ao iniciar o dev server (`npm run dev`).
- Após adicionar uma nova rota em `pages/`, inicie o dev server para que o `Link` e `useNavigate` reconheçam a nova rota.

## Exemplo de Estrutura
```
src/
  pages/
    index.tsx
    duel.tsx
    about/
      _layout.tsx
      index.tsx
      _components/
        AboutCard.tsx
      _hooks/
        useAboutData.ts
      _contexts/
        AboutContext.tsx
      _modals/
        AboutInfoModal.tsx
      _services/
        aboutApi.ts
  modals/
    WelcomeModal.tsx
  components/
    Header.tsx
    Footer.tsx
  hooks/
    useApi.ts
  contexts/
    GlobalProviders.tsx
  infra/
    api.ts
```

## Resumo de decisão
- Comece simples com arquivo único de rota.
- Evolua para pasta de feature quando a página crescer.
- Evite criar pasta por padrão sem necessidade real.