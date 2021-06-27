import { useHistory } from 'react-router-dom'

import illustrationImg from "../assets/images/illustration.svg";
import logoImg from "../assets/images/logo.svg";
import googleIconImage from "../assets/images/google-icon.svg"


import '../styles/auth.scss'
import { Button } from "../components/Button";
import { useAuth } from '../hooks/useAuth';
import { FormEvent, useState } from 'react';
import { database } from '../services/firebase';
 
export function Home(){
    const history = useHistory();
    const { user, signInWithGoogle } = useAuth();
    const [roomCode, setRoomCode] = useState('');

    async function handleCreateRoom() {
        if(!user) {
            await signInWithGoogle()
        }
        history.push('/rooms/new')
    }

    async function handleJoinRoom(event: FormEvent){
        event.preventDefault();
        if(roomCode.trim() === ''){
            return;
        }

        const roomRef = await database.ref(`rooms/${roomCode}`).get();
        if(!roomRef.exists()){
            alert('Room does not exists.');
            return;
        }

        if(roomRef.val().endedAt) {
            alert('Room already closed');
            return;
        }

        history.push(`/rooms/${roomCode}`);
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
                    <button className="create-room" onClick={handleCreateRoom}>
                        <img alt="" src={googleIconImage} />
                        Crie sua sala com o google
                    </button>
                    <div className="separator">
                        ou entre em uma salas
                    </div>
                    <form onSubmit={handleJoinRoom}>
                        <input 
                        onChange={event => setRoomCode(event.target.value)}
                        value ={roomCode}
                        type="text" 
                        placeholder="Digite o codigo da sala"
                        />
                        <Button type="submit">
                            Entrar na sala
                        </Button>
                    </form>
                </div>
            </main>
        </div>
    );
}