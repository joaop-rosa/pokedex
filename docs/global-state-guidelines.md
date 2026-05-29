# Diretrizes para Criação de Estados Globais

## Alinhamento com Arquitetura
- Este documento não define organização de pastas ou local de criação.
- Para decisões de estrutura e escopo por rota/feature, siga exclusivamente `docs/architecture-guidelines.md`.

## Quando Criar um Estado Global
- Crie um estado global apenas quando a informação precisar ser compartilhada por múltiplas áreas da aplicação.
- Prefira estado local quando o dado for usado por um único componente ou por uma árvore pequena.
- Prefira hooks especializados quando a lógica for reutilizável, mas o estado não precisar ser global.
- Não use `context` para dados de servidor, cache ou controle de requisições. Para esses casos, mantenha a responsabilidade em soluções como `react-query`.

## Casos Indicados
- Idioma selecionado pelo usuário.
- Dados de autenticação ou sessão.
- Preferências globais de interface.
- Sinalizadores de fluxo compartilhados entre páginas ou layouts.

## Casos que Devem Ser Evitados
- Estado temporário de formulário.
- Controle visual isolado, como abrir e fechar um modal local.
- Dados usados em apenas uma página.
- Valores derivados que podem ser calculados localmente.

## Estrutura Esperada
- Nomeie o arquivo com o sufixo `Provider`, como `ThemeProvider.tsx` ou `AuthProvider.tsx`.
- Exporte um hook de acesso, como `useTheme` ou `useAuth`, no mesmo arquivo do provider quando a implementação for simples.

## Padrão de Implementação
- Defina um tipo explícito para o valor compartilhado pelo contexto.
- Centralize no provider o estado e as ações que modificam esse estado.
- Exponha no hook apenas a API necessária para consumo.
- Mantenha a regra de negócio fora dos componentes consumidores.
- Evite contexts muito amplos com responsabilidades distintas. Se necessário, divida em múltiplos providers.

## Boas Práticas
- Inicialize o contexto com uma estrutura tipada e previsível.
- Lance erro no hook de consumo quando ele for usado fora do provider.
- Evite armazenar valores derivados no contexto quando eles puderem ser calculados a partir do estado base.
- Reduza re-renderizações desnecessárias mantendo o valor do contexto pequeno e coeso.
- Quando houver efeitos colaterais, como persistência em `localStorage` ou sincronização com API, mantenha essa lógica encapsulada no provider ou em hooks auxiliares.

## Exemplo de Estrutura
```tsx
import { createContext, type PropsWithChildren, useContext, useState } from 'react'

type Theme = 'light' | 'dark'

type ThemeContextProps = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextProps | null>(null)

export function ThemeProvider({ children }: PropsWithChildren) {
  const [theme, setTheme] = useState<Theme>('light')

  return <ThemeContext value={{ theme, setTheme }}>{children}</ThemeContext>
}

export function useTheme() {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }

  return context
}
```

## Integração com o Projeto
- Antes de criar um novo contexto, verifique se o domínio já possui um provider existente que pode ser estendido sem misturar responsabilidades.