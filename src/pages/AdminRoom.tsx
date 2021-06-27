import { FormEvent, useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'


import logoImg from '../assets/images/logo.svg'
import deleteImg from '../assets/images/delete.svg'
import checkImg from '../assets/images/check.svg'
import answerImg from '../assets/images/answer.svg'
import { Button } from '../components/Button'
import { Question } from '../components/Question'
import { RoomCode } from '../components/RoomCode'
import { useAuth } from '../hooks/useAuth'
import { useRoom } from '../hooks/useRoom'
import { database } from '../services/firebase'

import '../styles/room.scss'


type RoomParams = {
    id: string;
}

export function AdminRoom(){
    const { user } = useAuth();
    const [newQuestion, setNewQuestion ] = useState('');
    const history = useHistory();

    const params = useParams<RoomParams>();
    const roomId = params.id

    const { title, questions } = useRoom(roomId)

    async function handleDeleteQuestion(id: string) {
        if(window.confirm("Tem certeza que deseja deletar a pergunta?")){
            await database.ref(`rooms/${roomId}/questions/${id}`).remove();
        }
    }

    async function handleEndRoom(){
        if(window.confirm("Tem certeza que deseja encerrar a sala?")){
            database.ref(`rooms/${roomId}`).update({
                endedAt: new Date(),
            })
             history.push('/');
        }
    }

    async function handleCheckQuestionAnswer(id: string) {
        await database.ref(`rooms/${roomId}/questions/${id}`).update({
            isAnswered: true
        });

    }
    
    async function handleHighlightQuestion(id: string) {
        await database.ref(`rooms/${roomId}/questions/${id}`).update({
            isHighlighted: true
        });
    }
    
    

    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="Letmeask" />
                    <div>
                        <RoomCode code={roomId}/>
                        <Button isOutlined onClick={handleEndRoom}>Encerrar Sala</Button>
                    </div>
                </div>
            </header>
            <main>
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    { questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
                </div> 

                <div className="question-list">
                    {questions.map(question => {
                        return (
                            <Question 
                            key={question.id}
                            content={question.content} 
                            author={question.author}
                            isAnswered={question.isAnswered}
                            isHighlighted={question.isHighlighted}       
                            >

                                { !question.isAnswered && (
                                    <>                                                                    
                                        <button
                                            type="button"
                                            onClickCapture={() => handleCheckQuestionAnswer(question.id)}
                                            >
                                            <img src={checkImg} alt="Marcar pergunta como respondida"/>

                                        </button>
                                        <button
                                            type="button"
                                            onClickCapture={() => handleHighlightQuestion(question.id)}
                                            >
                                            <img src={answerImg} alt="Dar destaque a pergunta"/>

                                        </button>
                                    </>
                                ) }
                                <button
                                    type="button"
                                    onClickCapture={() => handleDeleteQuestion(question.id)}
                                    >
                                    <img src={deleteImg} alt="remover pergunta"/>

                                </button>
                            </Question>
                            )
                        })}
                </div>

            </main>
        </div>
        );
}


