const express = require('express');
const supabaseClient = require('@supabase/supabase-js');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Configurações do CORS
const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Middleware
app.use(morgan('combined'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configuração do cliente Supabase
const supabase = supabaseClient.createClient(
    'https://cxppcmhsklytddapemsg.supabase.co/',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4cHBjbWhza2x5dGRkYXBlbXNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA3NTg2MjksImV4cCI6MjA0NjMzNDYyOX0.qy6bqbsahdXHKNtuUTV6AbwankgSGoFl5_hXA2eNmY0'
);

// Consultar todos os produtos
app.get('/products', async (req, res) => {
    try {
        const { data, error } = await supabase.from('products').select();
        if (error) throw error;
        res.status(200).json(data);
        console.log('Listando todos os produtos:', data);
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.error('Erro ao listar produtos:', error.message);
    }
});

// Consultar um produto por ID
app.get('/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase.from('products').select().eq('id', id).single();
        if (error) throw error;
        res.status(200).json(data);
        console.log('Produto retornado:', data);
    } catch (error) {
        res.status(404).json({ error: error.message });
        console.error('Erro ao buscar produto:', error.message);
    }
});

// Cadastrar um produto
app.post('/products', async (req, res) => {
    try {
        const { name, description, price } = req.body;
        const { error } = await supabase.from('products').insert([{ name, description, price }]);
        if (error) throw error;
        res.status(201).send('Produto criado com sucesso!');
        console.log('Produto criado:', { name, description, price });
    } catch (error) {
        res.status(400).json({ error: error.message });
        console.error('Erro ao criar produto:', error.message);
    }
});

// Atualizar um produto
app.put('/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price } = req.body;
        const { error } = await supabase
            .from('products')
            .update({ name, description, price })
            .eq('id', id);
        if (error) throw error;
        res.status(200).send('Produto atualizado com sucesso!');
        console.log('Produto atualizado:', { id, name, description, price });
    } catch (error) {
        res.status(400).json({ error: error.message });
        console.error('Erro ao atualizar produto:', error.message);
    }
});

// Deletar um produto
app.delete('/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) throw error;
        res.status(200).send('Produto deletado com sucesso!');
        console.log('Produto deletado:', id);
    } catch (error) {
        res.status(400).json({ error: error.message });
        console.error('Erro ao deletar produto:', error.message);
    }
});

// Rota inicial
app.get('/', (req, res) => {
    res.send('API Supabase funcionando! 🌟');
});

// Rota para capturar outras rotas não definidas
app.get('*', (req, res) => {
    res.status(404).send('Rota não encontrada.');
});

// Iniciar servidor
app.listen(3000, () => {
    console.log('Servidor iniciado em http://localhost:3000');
});

