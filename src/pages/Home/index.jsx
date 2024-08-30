import { FaLongArrowAltDown } from "react-icons/fa"
import { CiLogout, CiCirclePlus, CiCircleCheck } from "react-icons/ci"
import { IoMdNotifications, IoMdNotificationsOff, IoMdSend, IoMdPerson } from "react-icons/io"
import { MdOutlineChat } from "react-icons/md"
import { GiGears } from "react-icons/gi";
import { FcCalendar } from "react-icons/fc";

import { useAuth } from "../../hooks/auth"
import { useNavigate } from "react-router-dom"
import { useState, useEffect, useRef } from "react"
import React from "react"
import { io } from "socket.io-client"
import { format } from 'date-fns'
import { ptBR } from "date-fns/locale"

import { Create } from "../../components/Create"
import { api } from "../../services/api"
import { Update } from "../../components/Update"

export function Home() {
    const { LogOut, user } = useAuth()
    const navigate = useNavigate()
    const [socket, setSocket] = useState(null)
    const [ notification, setNotification ] = useState(true)
    const [ pieces, setPieces ] = useState([])
    const [ dates, setDates ] = useState([])
    const [ usersConnect, setUsersConnect ] = useState([])
    const [ openUsersConnect, setOpenUsersConnect] = useState(false)
    const [ openUpdate, setOpenUpdate ] = useState(false)
    const [ pieceUpdate, setPieceUpdate] = useState({})
    const [ openChat, setOpenChat ] = useState(false)

    const [ openModalCreate, setOpenModalCreate ] = useState(false) // Visibility controller to modal of creation

    let dateNow = new Date()
    dateNow = format(dateNow, 'dd/MM/yyyy', { locale: ptBR })

    const [message, setMessage] = useState('')
    const [messageList, setMessageList] = useState([])

    const bottomRef = useRef();
    const notificationSound = useRef(new Audio('/sounds/notification.mp3'))

    function scrollDown() {
        setTimeout(() => {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' })
        }, 100)
    }

    const handleNotification = () => {
        setNotification(!notification) 
    }   

    const handleLogOut = () => {
        navigate('/')
        setSocket(null)
        LogOut()
    }

    const handleRefresh = () => {
        if(!socket) return

        socket.emit('refresh')
    }
    
    const handleOpenModalCreate = () => {
        setOpenModalCreate(true)
    }

    const handleCloseModalCreate = () => {
        setOpenModalCreate(false)
    }

    const handleOpenUsersConnect = () => {
        setOpenUsersConnect(!openUsersConnect)
    }

    const handleOpenUpdate = (pieceUpdate) => {
        setOpenUpdate(true)
        setPieceUpdate(pieceUpdate)
    }

    const handleCloseUpdate = () => {
        setOpenUpdate(false)
    }

    const handleOpenChat = () => {
        setOpenChat(!openChat)
    }

    useEffect(() => {
        async function connectionSocket() {
            const socket = io('http://localhost:3000')
            socket.emit('set_username', user.name)
            setSocket(socket)
        }

        connectionSocket()
    }, [])

    useEffect(() => {
        if (!socket) return

        socket.on('receive_message', data => {
            setMessageList((current) => [...current, data])

            if(notification && data.author !== user.name) {
                notificationSound.current.play()
            }
            scrollDown()
        })

        return () => socket.off('receive_message')
    }, [socket, notification])

    useEffect(() => {
        if (!socket) return

        socket.on('reload', reload => {
            setTimeout(() => {
                fetchPieces() 
            }, 2000)
        })
        
        return () => socket.off('reload')
    }, [socket])

    useEffect(() => {
        if (!socket) return

        socket.on('users:update', (users)=> {
            setUsersConnect(users)
        })
        
        return () => socket.off('users:update')
    }, [socket])

    const handleSubmit = async (event) => {
        event.preventDefault()

        if (!message.trim()) return

        socket.emit('message', message)
        setMessage('')
    }

    async function fetchPieces() {
        const response = await api.get('/pieces')

        const piecesAux = response.data.map(piece => {
            const [ , hours] = piece.created_at.split(' ')

            return {
                ...piece,
                hours,
                created_at: format(new Date(piece.created_at), 'dd/MM/yyyy', { locale: ptBR })
            }
        })

        const datesAux = []
        piecesAux.forEach(piece => {
            if(!datesAux.includes(piece.created_at) && piece.created_at !== dateNow) {
                datesAux.push(piece.created_at)
            }
        })
       
        setDates(datesAux)
        setPieces(piecesAux)
    }

    useEffect(() => {
        fetchPieces()
    }, [])

    useEffect(() => {
        // Função para verificar a largura da janela e atualizar a variável openChat
        const handleResize = () => {
          if (window.innerWidth > 1280) {
            setOpenChat(true);
          } 
        }
    
        // Adiciona o listener de evento resize
        window.addEventListener('resize', handleResize);
    
        // Verifica a largura da janela na montagem do componente
        handleResize();
    
        // Remove o listener quando o componente for desmontado
        return () => window.removeEventListener('resize', handleResize);
      }, []); //

    return (
        <div id="home">
            <nav id="header" className="fixed top-0 right-0 left-0 h-14 bg-cyan-600 flex items-center pl-4 gap-8">
                <div className="flex items-center gap-2">
                    <small>Sair</small>
                    <CiLogout onClick={handleLogOut} cursor="pointer" size={24} className="hover:scale-110"/>
                </div>
              
                {notification === true ? 
                    <div className="flex items-center gap-2">
                        <small className="w-20">Remover som</small>
                        <IoMdNotifications onClickCapture={handleNotification} size={24} cursor="pointer" className="hover:scale-110"/> 
                    </div>
                    :
                    <div className="flex items-center gap-2">
                        <small className="w-20">Ativar som</small>
                        <IoMdNotificationsOff onClick={handleNotification} size={24} cursor="pointer" className="hover:scale-110"/> 
                    </div>
                }
                
                <div className="flex items-center gap-2">
                    <small>Solicitar peça</small>
                    <CiCirclePlus id="button-create" onClick={handleOpenModalCreate} size={28} cursor="pointer" className="hover:scale-110"/>
                </div> 

                <div className="flex items-center gap-2 xl:hidden">
                    <small>{openChat === true ? 'Fechar chat' : 'Abrir chat'}</small>
                    <MdOutlineChat size={28} cursor="pointer" onClick={handleOpenChat} className="hover:scale-110"/>
                </div>
            </nav>
            
            <Create isTrue={openModalCreate} isClose={handleCloseModalCreate} isCreate={handleRefresh}/>            
            <Update openUpdate={openUpdate} onClick={handleCloseUpdate} data={pieceUpdate} isUpdate={handleRefresh}/>
            
            { openChat === true &&
            <form id="chat" onSubmit={handleSubmit} className="p-2">
                <div className="bg-white flex items-center gap-2 pl-4 persons shadow-md">
                    <IoMdPerson className="text-cyan-600 hover:scale-110" 
                                onClick={handleOpenUsersConnect} 
                                cursor="pointer" 
                                size={20}
                    />

                    <span className="size-5 font-bold">
                        {usersConnect.length}
                    </span> 
                </div>

                <div className="usersconnect shadow-lg"
                data-open-users-connect={openUsersConnect}
                >   
                    <small>Usuários conectados</small>
                    {usersConnect && usersConnect.map((user, index) => (
                        <p key={String(index)}>
                            {user.name}
                        </p>
                    ))}
                </div>

                <div id="container-message" className='p-2 bg-white flex flex-col gap-2 shadow-md'>
                    {messageList.map((message, index) => (
                        <p id="paragraph"
                            className={`p-2 rounded-lg ${user.name === message.author ? 'self-end bg-cyan-600' : 'self-start bg-neutral-200'}`}
                            key={index}>

                            <strong className="mb-2">{message.author}</strong>
                            <p>{message.text}</p>
                        </p>
                    ))}

                    <div ref={bottomRef}></div>
                </div>
                
                <div id="submit" className="flex items-center gap-2 bg-white pl-2 pr-2 shadow-md">
                    <input
                        type="text"
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        placeholder="Enviar mensagem"
                        className="h-3/4 w-11/12 outline-none bg-transparent border-b border-cyan-600"
                    />

                    <button type="submit"><IoMdSend size={24} className="text-cyan-600 hover:scale-110"/></button>
                </div>
            </form>}

           <div className="content">
               
               <table className="table">
                   <thead>
                       <tr>
                           <th colSpan={8} className="">
                               <div className="flex items-center justify-center gap-2 h-14">
                                   <FcCalendar size={32}/> {dateNow}
                               </div>
                           </th>
                       </tr>
               
                       <tr>
                           <th>Horas</th>
                           <th>Nome</th>
                           <th>Código</th>
                           <th>Porta Palete</th>
                           <th>Empresa</th>
                           <th>Quantidade</th>
                           <th>Requisição Vista?</th>
                           <th>Horas que Desceu</th>
                       </tr>
                   </thead>
               
                   <tbody>
                   {pieces && pieces.filter(piece => piece.created_at === dateNow).length > 0 ? (
                       pieces.filter(piece => piece.created_at === dateNow).map((piece, index) => (
                           <tr key={index} className="cursor-pointer hover:bg-neutral-200" onClick={() => handleOpenUpdate(piece)}>
                               <td>{piece.hours}</td>
                               <td>{piece.name}</td>
                               <td>{piece.code}</td>
                               <td>{piece.pallet_rack}</td>
                               <td className={`${piece.company === 'Patral' ? 'text-cyan-600' : 'text-red-600'}`}>{piece.company}</td>
                               <td>{piece.amount !== 0 ? piece.amount : ''}</td>
                               <td>{piece.look ? <CiCircleCheck className="check"/> : ''}</td>
                               <td>{piece.hours_down ? piece.hours_down : ''}</td>
                           </tr>
                       ))
                   ) : (
                       <tr>
                           <td colSpan={8}>
                               <div className="text-center h-32 flex items-center justify-center gap-4">
                                   <GiGears className="text-cyan-600"/>
                                   Não há peças para esta data.
                               </div>
                           </td>
                       </tr>
                   )}
               
                       { dates &&
                           <tr className="tr-before">
                               <th colSpan={8} className="border border-neutral-200">
                                   <div className="before-days">
                                       <FaLongArrowAltDown/>
                                       <p>Dias Passados</p>
                                       <FaLongArrowAltDown />
                                   </div>
                               </th>
                           </tr>
                       }
               
                       {dates &&
                           dates.map((date, index) => (
                               <React.Fragment key={index}>
                                   <tr>
                                       <th colSpan={8} >
                                           <div className="flex items-center justify-center gap-2 h-14">
                                               <FcCalendar size={32}/> {date}
                                           </div>
                                       </th>
                                   </tr>
                                   {pieces.filter(piece => piece.created_at === date).map(piece => (
                                       <tr key={String(piece.id)} className="hover:bg-neutral-200">
                                           <td>{piece.hours}</td>
                                           <td>{piece.name}</td>
                                           <td>{piece.code}</td>
                                           <td>{piece.pallet_rack}</td>
                                           <td className={`${piece.company === 'Patral' ? 'text-cyan-600' : 'text-red-600'}`}>{piece.company}</td>
                                           <td>{piece.amount !== 0 ? piece.amount : ''}</td>
                                           <td>{piece.looked ? <CiCircleCheck className="check" /> : ''}</td>
                                           <td>{piece.hours_down ? piece.hours_down : ''}</td>
                                       </tr>
                                   ))}
                                   <tr>
                                       <th colSpan={8} className="border border-neutral-200">
                                           <div className="before-days">
               
                                           </div>
                                       </th>
                                   </tr>
                               </React.Fragment>
                           ))
                       }
                   </tbody>
               </table>
           </div>

            <footer id="footer" className="fixed bottom-0 right-0 left-0 h-14 bg-cyan-600 text-zinc-700 flex justify-center items-center italic">Desenvolvido por Felipe Pinheiro</footer>
        </div>
    );
}
