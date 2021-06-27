import { Link, useHistory } from 'react-router-dom'
import { FormEvent, useState } from 'react'

import illustrationImg from "../assets/images/illustration.svg";
import logoImg from "../assets/images/logo.svg";
import { Button } from "../components/Button";

import '../styles/auth.scss'
import { database } from '../services/firebase';
import { useAuth } from '../hooks/useAuth';

export function NewRoom(){
    const history = useHistory();
    const { user } = useAuth();
    const [newRoom, setNewRoom] = useState('');

    async function handleCreateRoom(event: FormEvent) {
        event.preventDefault();

        if(newRoom.trim() === ''){
            return;
        }

        const roomRef = database.ref('rooms');

        const firebaseRoom = await roomRef.push({ 
            title: newRoom, 
            authorId: user?.id,  
        }); 

        history.push(`/admin/rooms/${firebaseRoom.key}`);
    }

    return (
        <div id='page-auth'>
        <aside>
            <img alt="" src={illustrationImg}/>
            <strong>Crie salas de Q&amp;A ap-vivo</strong>
            <p>Tire as duvidas da sua audiencia em tempo real</p>
        </aside>
        <main>
            <div className="main-content">
                <img alt="" src={logoImg}/>
                <h2> Criar uma nova sala </h2>
                <form onSubmit={handleCreateRoom}>
                    <input 
                    onChange={ event => setNewRoom(event.target.value) }
                    value={newRoom}
                    type="text" 
                    placeholder="Nome da sala"
                    />
                    <Button type="submit">
                        Criar sala
                    </Button>
                </form>
                <p>Quer entrar em uma sala existente? <Link to="/">Clique aqui</Link></p>
            </div>
        </main>
    </div>
    )
}