import { useEffect, useState } from 'react';
import api from '../api/api';
import Navbar from '../components/Navbar';
import './Pesquisadores.css';
import { FaEdit, FaTrash } from 'react-icons/fa';

export default function Pesquisadores() {
    const [lista, setLista] = useState([]);
    const [editando, setEditando] = useState(null);

    const [form, setForm] = useState({
        nome: '',
        cpf: '',
        email: '',
        area_atuacao: ''
    });

    async function carregar() {
        try {
            const res = await api.get('/pesquisadores');
            setLista(res.data);
        } catch (err) {
            console.error(err);
        }
    }
    useEffect(() => {
        async function fetchData() {
            await carregar();
        }
        fetchData();
    }, []);

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function salvar(e) {
        e.preventDefault();

        try {
            if (editando) {
                await api.put(`/pesquisadores/${editando}`, form);
            } else {
                await api.post('/pesquisadores', form);
            }

            setForm({ nome: '', cpf: '', email: '', area_atuacao: '' });
            setEditando(null);
            carregar();

        } catch (err) {
            console.error(err);
        }
    }

    function editar(p) {
        setForm(p);
        setEditando(p.id);
    }

    async function excluir(id) {
        try {
            await api.delete(`/pesquisadores/${id}`);
            carregar();
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div className="pesq-page">
            <Navbar />

            <div className="pesq-container">

                <h2 className="pesq-title">Pesquisadores</h2>

                {/* FORM */}
                <form className="pesq-card" onSubmit={salvar}>

                    <input className="input" name="nome" placeholder="Nome" value={form.nome} onChange={handleChange} />

                    <input className="input" name="cpf" placeholder="CPF" value={form.cpf} onChange={handleChange} />

                    <input className="input" name="email" placeholder="Email" value={form.email} onChange={handleChange} />

                    <input className="input" name="area_atuacao" placeholder="Área de atuação" value={form.area_atuacao} onChange={handleChange} />

                    <button className="btn-primary" type="submit">
                        {editando ? 'Atualizar' : 'Cadastrar'}
                    </button>

                </form>

                {/* LISTA */}
                <div className="pesq-list">
                    {lista.map(p => (
                        <div key={p.id} className="pesq-item">

                            <div>
                                <b>{p.nome}</b>
                                <p>{p.area_atuacao}</p>
                            </div>

                            <div className="actions">
                                <button className="btn-icon edit" onClick={() => editar(p)}>
                                    <FaEdit />
                                </button>

                                <button className="btn-icon delete" onClick={() => excluir(p.id)}>
                                    <FaTrash />
                                </button>
                            </div>

                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}