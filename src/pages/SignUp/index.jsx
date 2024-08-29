import { FaLongArrowAltRight } from "react-icons/fa";
import { useAuth } from "../../hooks/auth"
import { useState } from "react"

export function SignUp() {
  const { Login } = useAuth()
  const [ name, setName ] = useState('')
  
  async function handleLogin(e) {
    e.preventDefault()

    if(name === '') {
      return alert('Insira seu nome')
    }
    
    const user = {
      name: name
    }

    Login(user)
  }

  return (
    <div id="container" className="flex flex-col justify-center items-center gap-12">
        <header>
          <h1>Peças para descer do Porta Palete</h1>
        </header>

        <form className="bg-white flex items-center justify-center gap-2 h-32 w-80 shadow-md" onSubmit={handleLogin}>
          <input type="text" name="name" id="name" className="w-3/4 h-10 p p-2 border-b border-cyan-600 outline-none" placeholder="Insira seu nome" autoComplete="off" required onChange={e => setName(e.target.value)}/>
          <button type="submit" className="text-cyan-600 hover:text-cyan-500" ><FaLongArrowAltRight size={24}/></button>
        </form>
        <footer className="absolute bottom-0 right-0 left-0 flex justify-center items-center bg-cyan-600 text-zinc-700 h-8 italic">Desenvolvido por Felipe Pinheiro</footer>
    </div>
  )
}

