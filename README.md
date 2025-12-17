# Order Processor 📦

Um sistema de processamento de pedidos robusta e escalável, construído com **Node.js**, **TypeScript**, **Express**, **RabbitMQ** e **MongoDB**. O projeto implementa padrões de arquitetura moderna com fila de mensagens, persistência de dados e tratamento de erros resiliente.

## 🎯 Objetivo

O **Order Processor** é uma ferramenta para processar pedidos de forma assíncrona e confiável. Ele oferece:

- **API REST** para receber pedidos
- **Fila de mensagens** (RabbitMQ) para processamento assíncrono
- **Persistência em banco de dados** (MongoDB) para armazenamento durável
- **Tratamento de erros com retry automático** e Dead Letter Queue (DLQ)
- **Escalabilidade horizontal** com suporte a múltiplos consumers

### Fluxo de Funcionamento

```
Cliente → POST /order → API Express → RabbitMQ (orders_exchange)
                                          ↓
                                    Consumer (newConsumer)
                                          ↓
                                    MongoDB (persistência)
                                          ↓
                      ✅ Sucesso ou ❌ Erro (com retry)
                                          ↓
                            DLQ (Dead Letter Queue)
```

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Versão | Finalidade |
|------------|--------|-----------|
| **Node.js** | 20-alpine | Runtime JavaScript |
| **TypeScript** | ^5.9.3 | Tipagem estática e segurança |
| **Express** | ^5.1.0 | Framework web |
| **MongoDB** | 6 | Banco de dados NoSQL |
| **Mongoose** | ^8.19.1 | ODM para MongoDB |
| **RabbitMQ** | 3-management | Message broker |
| **amqplib** | ^0.10.9 | Cliente AMQP para RabbitMQ |
| **dotenv** | ^17.2.3 | Gerenciamento de variáveis de ambiente |
| **Docker** | - | Containerização |
| **tsx** | ^4.20.6 | Execução de TypeScript em desenvolvimento |

## 📋 Padrões e Boas Práticas

### 1. **Arquitetura em Camadas**
- `routes/` - Rotas HTTP e endpoints da API
- `services/` - Lógica de negócio (preparado para expansão)
- `queue/` - Producer e Consumer para RabbitMQ
- `models/` - Schemas e modelos de dados
- `config/` - Configurações (banco de dados, variáveis de ambiente)

### 2. **Tipagem Forte com TypeScript**
```typescript
export interface IOrder extends Document {
  customerId: string;
  customerEmail: string;
  total: number;
  items: IItem[];
  createdAt: Date;
}
```

### 3. **Padrão Producer-Consumer**
- **Producer** (`producer.ts`): Publica mensagens na fila
- **Consumer** (`newConsumer.ts`): Consome e processa mensagens de forma assíncrona

### 4. **Retry Automático com Backoff**
- Mensagens com erro são reenviadas até 3 vezes
- Após máximo de tentativas, são enviadas para DLQ (Dead Letter Queue)
- Implementado via headers customizados (`x-retry-count`)

### 5. **Tratamento de Erros Resiliente**
```typescript
- Try-catch em operações críticas
- Confirmação (ack) ou rejeição (nack) de mensagens
- Logging descritivo com emojis para fácil identificação
```

### 6. **Variáveis de Ambiente**
```env
NODE_ENV=development
MONGO_URI=mongodb://root:secret@localhost:27017/ordersdb?authSource=admin
RABBITMQ_URL=amqp://localhost:5672
```

### 7. **Módulos ECMAScript (ESM)**
- Configurado em `package.json` com `"type": "module"`
- Importações modernas: `import ... from '...js'`

## 📁 Estrutura do Projeto

```
order-processor/
├── src/
│   ├── server.ts                 # Entrada da aplicação
│   ├── config/
│   │   └── database.ts          # Conexão com MongoDB
│   ├── models/
│   │   └── order.model.ts       # Schema de Pedido
│   ├── queue/
│   │   ├── producer.ts          # Publica pedidos na fila
│   │   ├── newConsumer.ts       # Consome e processa pedidos
│   │   ├── consumer.ts          # Consumer adicional
│   │   └── emailConsumer.ts     # Consumer para emails
│   ├── routes/
│   │   └── order.routes.ts      # Rotas da API
│   └── services/                # Lógica de negócio (expandir aqui)
├── Dockerfile                   # Imagem Docker da aplicação
├── docker-compose.yml           # Orquestração de containers
├── package.json                 # Dependências e scripts
├── tsconfig.json               # Configuração TypeScript
└── README.md                    # Este arquivo
```

## 🚀 Como Executar

### Pré-requisitos

- **Node.js** 20+ instalado
- **Docker** e **Docker Compose** instalados
- **Git** para clonar o repositório

### Opção 1: Execução Local (sem Docker)

#### 1. Clonar o repositório
```bash
git clone https://github.com/pedrofurns7/order-processor.git
cd order-processor
```

#### 2. Instalar dependências
```bash
npm install
```

#### 3. Configurar variáveis de ambiente
Crie um arquivo `.env` na raiz do projeto:
```env
NODE_ENV=development
MONGO_URI=mongodb://root:secret@localhost:27017/ordersdb?authSource=admin
RABBITMQ_URL=amqp://localhost:5672
```

#### 4. Iniciar RabbitMQ e MongoDB (Docker)
```bash
# Apenas RabbitMQ
docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management

# Apenas MongoDB
docker run -d --name mongo -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=root \
  -e MONGO_INITDB_ROOT_PASSWORD=secret \
  -e MONGO_INITDB_DATABASE=ordersdb \
  mongo:6
```

#### 5. Iniciar o servidor em desenvolvimento
```bash
npm run dev
```

O servidor estará rodando em `http://localhost:3000`

---

### Opção 2: Execução com Docker Compose (Recomendado)

#### 1. Clonar o repositório
```bash
git clone https://github.com/pedrofurns7/order-processor.git
cd order-processor
```

#### 2. Criar arquivo `.env`
```env
NODE_ENV=production
MONGO_URI=mongodb://root:secret@mongo:27017/ordersdb?authSource=admin
RABBITMQ_URL=amqp://rabbitmq:5672
```

#### 3. Iniciar todos os serviços
```bash
docker-compose up -d
```

Isso irá:
- ✅ Compilar a aplicação (TypeScript → JavaScript)
- ✅ Iniciar a API no porta 3000
- ✅ Iniciar RabbitMQ (porta 5672 e Management 15672)
- ✅ Iniciar MongoDB (porta 27017)

#### 4. Verificar se está rodando
```bash
docker-compose ps
```

---

## 📮 Como Usar a API

### Endpoint: Criar Pedido

**POST** `/order`

#### Request Body
```json
{
  "customerId": "cust_12345",
  "customerEmail": "cliente@example.com",
  "total": 150.50,
  "items": [
    {
      "name": "Produto A",
      "price": 100.00
    },
    {
      "name": "Produto B",
      "price": 50.50
    }
  ]
}
```

#### Response (Sucesso)
```json
{
  "message": "Order received",
  "order": {
    "customerId": "cust_12345",
    "customerEmail": "cliente@example.com",
    "total": 150.50,
    "items": [
      {
        "name": "Produto A",
        "price": 100.00
      },
      {
        "name": "Produto B",
        "price": 50.50
      }
    ],
    "createdAt": "2025-12-16T10:30:00Z"
  }
}
```

#### Response (Erro)
```json
{
  "error": "Invalid order data"
}
```

---

## 🔍 Monitorar a Aplicação

### Logs em Tempo Real
```bash
docker-compose logs -f api
```

### Acessar RabbitMQ Management
- URL: `http://localhost:15672`
- Usuário: `guest`
- Senha: `guest`

### Acessar MongoDB
```bash
docker exec -it mongo mongosh -u root -p secret
```

---

## 🛑 Parar a Aplicação

### Local
```bash
# Parar o servidor (Ctrl+C no terminal)
npm run dev
```

### Docker
```bash
docker-compose down

# Para remover volumes (dados) também:
docker-compose down -v
```

---

## 🔧 Scripts Disponíveis

```bash
npm run dev       # Executa em modo desenvolvimento (tsx)
npm run build     # Compila TypeScript para JavaScript
npm start         # Executa a versão compilada
npm run test      # Executa testes (ainda não implementado)
```

---

## 📚 Próximos Passos / Melhorias

- [ ] Implementar testes unitários e de integração
- [ ] Adicionar autenticação e autorização
- [ ] Implementar paginação na listagem de pedidos
- [ ] Criar endpoints para consultar status de pedidos
- [ ] Adicionar validação com Zod ou Yup
- [ ] Implementar cache com Redis
- [ ] Adicionar métricas e monitoramento (Prometheus)
- [ ] Documentação com Swagger/OpenAPI

---

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 📝 Licença

Este projeto está sob licença ISC. Veja o arquivo `package.json` para mais detalhes.

---

## 👨‍💻 Autor

**Pedro Furns** - [@pedrofurns7](https://github.com/pedrofurns7)

---

## 💬 Suporte

Para dúvidas ou problemas, abra uma [issue](https://github.com/pedrofurns7/order-processor/issues) no GitHub.

---

**Desenvolvido com ❤️ e ☕**