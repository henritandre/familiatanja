# Site da Família Tanja

Um site moderno e elegante para preservar e compartilhar a história e legado da Família Tanja, com design inspirado na Apple e integração com Firebase.

## 🌟 Características

- **Design Moderno**: Interface elegante inspirada no design da Apple
- **Scroll Infinito**: Transições suaves entre seções com efeitos de parallax
- **Responsivo**: Funciona perfeitamente em desktop, tablet e mobile
- **Árvore Genealógica Interativa**: Visualização hierárquica da família com detalhes completos
- **Calendário Familiar**: Acompanhamento de aniversários e datas importantes
- **Estatísticas Avançadas**: Análises e dados curiosos sobre a família
- **Integração Firebase**: Dados dinâmicos e atualizáveis em tempo real

## 🚀 Tecnologias Utilizadas

- **React 19** - Framework frontend
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Estilização
- **Framer Motion** - Animações e transições
- **Firebase** - Banco de dados e backend
- **Recharts** - Gráficos e visualizações
- **Lucide React** - Ícones

## 📁 Estrutura do Projeto

```
familia-tanja-site/
├── src/
│   ├── components/          # Componentes React
│   │   ├── FamilyTree.jsx   # Árvore genealógica
│   │   ├── FamilyCalendar.jsx # Calendário familiar
│   │   └── FamilyStats.jsx  # Estatísticas
│   ├── hooks/               # Hooks personalizados
│   │   └── useFamilyData.js # Hook para dados do Firebase
│   ├── lib/                 # Configurações
│   │   └── firebase.js      # Configuração do Firebase
│   ├── utils/               # Utilitários
│   │   └── familyUtils.js   # Funções auxiliares
│   ├── assets/              # Imagens e recursos
│   ├── App.jsx              # Componente principal
│   └── main.jsx             # Ponto de entrada
├── public/                  # Arquivos públicos
└── package.json             # Dependências
```

## 🔧 Configuração

### 1. Instalação

```bash
# Clone o repositório
git clone [url-do-repositorio]
cd familia-tanja-site

# Instale as dependências
pnpm install
```

### 2. Configuração do Firebase

1. Crie um projeto no [Firebase Console](https://console.firebase.google.com/)
2. Ative o Firestore Database
3. Copie as credenciais do projeto
4. Edite o arquivo `src/lib/firebase.js` com suas credenciais:

```javascript
const firebaseConfig = {
  apiKey: "sua-api-key",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-project-id",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "123456789",
  appId: "seu-app-id"
}
```

### 3. Estrutura de Dados no Firebase

Crie as seguintes coleções no Firestore:

#### Coleção: `membros`
Cada documento representa um membro da família:

```json
{
  "nomeCompleto": "João Silva Tanja",
  "nome": "João",
  "sobrenome": "Silva Tanja",
  "apelido": "Vô João",
  "sexo": "M",
  "nascimento": "1920-03-15",
  "falecimento": "1995-12-20",
  "localNascimento": "São Paulo, SP",
  "localFalecimento": "São Paulo, SP",
  "moraEm": "São Paulo, SP",
  "casadoCom": "id-do-conjuge",
  "pai": "id-do-pai",
  "mae": "id-da-mae",
  "outrosPai": "Nome do pai (se ID = 99)",
  "outrosMae": "Nome da mãe (se ID = 99)",
  "foto": "url-da-foto"
}
```

#### Documento: `familiaTanja/infoGeral`
Informações gerais da família:

```json
{
  "titulo": "Família Tanja",
  "subtitulo": "História e Legado",
  "textoIntroducao": "A história deste braço da Família Tanja..."
}
```

### 4. Importação de Dados da Planilha

Se você tem dados em planilha, use a estrutura:

| ID | Nome Completo | Nome | Sobrenome | Apelido | Sexo | Nascimento | Falecimento | Mãe | Pai | Casado Com | Local de Nascimento | Mora em | Local de Falecimento | Outros Mãe | Outros Pai |

- **ID**: Identificador único
- **Sexo**: M ou F
- **Mãe/Pai**: ID do pai/mãe, ou 99 se for agregado/fora do casamento
- **Outros Mãe/Pai**: Nome dos pais quando ID = 99

## 🎯 Funcionalidades

### 1. Página Inicial (Hero)
- Título elegante com animações
- Scroll indicator
- Transições suaves

### 2. História da Família
- Background com foto da família
- Texto narrativo sobre os fundadores
- Contadores dinâmicos de descendentes

### 3. Árvore Genealógica
- Visualização hierárquica interativa
- Modal com detalhes completos de cada membro
- Informações com emojis e formatação elegante
- Cálculos automáticos de idade, filhos, netos

### 4. Calendário Familiar
- Visualização mensal e anual
- Próximos aniversários
- Datas de falecimento (memorial)
- Navegação intuitiva

### 5. Estatísticas da Família
- Gráficos interativos (barras, pizza, linha)
- Dados curiosos e análises
- Distribuições por gênero, local, década
- Recordes familiares

## 🚀 Desenvolvimento

```bash
# Iniciar servidor de desenvolvimento
pnpm run dev

# Build para produção
pnpm run build

# Preview da build
pnpm run preview
```

## 📱 Responsividade

O site é totalmente responsivo e funciona em:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🎨 Personalização

### Cores e Tema
Edite as variáveis CSS em `src/App.css` para personalizar:
- Cores primárias e secundárias
- Tipografia
- Espaçamentos
- Animações

### Conteúdo
- Textos: Edite diretamente nos componentes
- Imagens: Substitua em `src/assets/`
- Dados: Atualize no Firebase

## 🔒 Segurança

- Configure as regras do Firestore para controlar acesso
- Use variáveis de ambiente para credenciais sensíveis
- Implemente autenticação se necessário

## 📈 Performance

- Lazy loading de componentes
- Otimização de imagens
- Code splitting automático
- Cache de dados do Firebase

## 🚀 Deploy

### Vercel (Recomendado)
1. Conecte seu repositório GitHub ao Vercel
2. Configure as variáveis de ambiente do Firebase
3. Deploy automático a cada push

```bash
# Instalar Vercel CLI (opcional)
npm i -g vercel

# Deploy via CLI
vercel

# Deploy de produção
vercel --prod
```

### Teste Local
```bash
# Testar em desenvolvimento
pnpm run dev

# Testar build de produção
pnpm run build
pnpm run preview
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto é privado e destinado exclusivamente à Família Tanja.

## 📞 Suporte

Para dúvidas ou suporte, entre em contato com o desenvolvedor.

---

**Desenvolvido com ❤️ para preservar a história da Família Tanja**

