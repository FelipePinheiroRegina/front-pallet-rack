import { CiCircleRemove } from "react-icons/ci"
import { FaCheckCircle } from "react-icons/fa";
import { useState } from "react"
import { useAuth } from "../../hooks/auth"
import { api } from "../../services/api"


export function Create({ isTrue, isClose, isCreate}) {
    const { user, LogOut } = useAuth()
    const [ name, setName ] = useState(user.name)
    const [ code, setCode ] = useState('')
    const [ pallet_rack, setPallet_rack ] = useState('')
    const [ company, setCompany ] = useState('Patral')
    const [ amount, setAmount ] = useState('')

    const handleCheckBoxChange = (option) => {
        setCompany(option)
    }

    async function handleCreate(e) {
        e.preventDefault()

        if(!name) {
            alert('Deslogamento automático pois não foi encontrado um nome de usuário!')
            return LogOut()
        }

        if(!pallet_rack || !code) {
            return alert('Os campos código e porta palete são obrigatórios!')
        }

        if(company === 'Gtex' && !amount) {
            return alert('Peças da gtex precisa ter quantidade!')
        }

        try {
            const response = await api.post('/pieces', {name, code, pallet_rack, company, amount})
            document.querySelector('.loader').classList.add('true')
            isCreate()

            setTimeout(() => {
                document.querySelector('.loader').classList.remove('true')
                setCode('')
                setPallet_rack('')
                setAmount('')

                document.querySelector('.approved').classList.add('true')
                
                setTimeout(() => {
                    document.querySelector('.approved').classList.remove('true')
                }, 2000)
            }, 2000)
            
        } catch (error) {
            console.error(error)
            alert('Erro ao fazer a solicitação!')
        }
    }

    return (
        <div id="Modal-Create" className="fixed" data-open={isTrue}>
            <header className="w-full grid bg-cyan-600 h-14 items-center pr-8">
                <div className="justify-self-end flex items-center gap-2">
                    <small>Fechar modal</small>
                    <CiCircleRemove onClick={isClose} size={32} cursor="pointer" className="hover:scale-110"/>
                </div>
            </header>

            <form onSubmit={(e) => handleCreate(e)} id="form-create" className="bg-white flex justify-self-center self-center">
                <div id="bg-image" className="bg-white w-6/12">
                        
                </div>

                <div id="inputs" className="flex flex-col w-6/12 items-center justify-center bg-neutral-200 p-8 gap-4">
                    <label htmlFor="code" className="flex flex-col w-full">
                        <small>Código</small>
                        <input 
                            type="text" 
                            name="code" 
                            id="code" 
                            placeholder="ex.: 5047" 
                            className="h-11 border-b border-cyan-600 outline-none p-2"
                            value={code}
                            onChange={e => setCode(e.target.value)} 
                            required   
                        />
                    </label>

                    <label htmlFor="pallet" className="flex flex-col w-full">
                        <small>Porta Palete</small>
                        <input 
                            type="text" 
                            name="pallet" 
                            id="pallet" 
                            placeholder="ex.: PP014G2" 
                            className="h-11 border-b border-cyan-600 outline-none  p-2"
                            value={pallet_rack}
                            onChange={e => setPallet_rack(e.target.value)}
                            required
                        />

                    </label>

                    <fieldset className="w-full border border-cyan-600 bg-white p-2 flex flex-col gap-2">
                        <legend>Empresa</legend>

                        <label htmlFor="patral">
                            <input
                                type="checkbox"
                                id="patral" 
                                checked={company === 'Patral'}
                                onChange={() => handleCheckBoxChange('Patral')} 
                                className="cursor-pointer"/> PATRAL
                        </label>

                        <label htmlFor="gtex" >
                            <input 
                                type="checkbox" 
                                id="gtex"
                                checked={company === "Gtex"}
                                onChange={() => handleCheckBoxChange('Gtex')}
                                className="cursor-pointer"/> GTEX
                        </label>
                    </fieldset>


                    <label htmlFor="amount" className="flex flex-col w-full">
                        <small>Quantidade - {company === "Patral" ? "(Opcional)" : "(Obrigatório)"} </small>  
                        <input 
                            type="number" 
                            name="amount" 
                            id="amount" 
                            className="h-11 border-b border-cyan-600 outline-none p-2" 
                            placeholder="ex.: 200"
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                            required={company === 'Gtex'}
                        />
                    </label>

                    <div className="w-full flex justify-end items-center gap-8">
                        <div className="loader"></div>
                        
                        <div className="approved">
                            <small>solicitação bem-sucedida</small>
                            <FaCheckCircle className="text-cyan-600"/>
                        </div>

                        <button
                            id="button-create-modal"
                            type="submit" 
                            className="h-11 p-4 flex items-center justify-center bg-cyan-600 hover:bg-cyan-500 shadow-lg">Solicitar</button>
                            
                    </div>
                </div>
            </form>
        </div>
    )
}