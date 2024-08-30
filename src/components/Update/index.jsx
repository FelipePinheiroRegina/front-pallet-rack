import { CiCircleRemove, CiClock1, CiCircleCheck } from "react-icons/ci"
import { FiCircle } from "react-icons/fi";
import { useState, useEffect } from "react"
import { format } from 'date-fns';
import { api } from "../../services/api";

export function Update({ openUpdate, onClick, data, isUpdate}) {
    const [company, setCompany] = useState(data.company || ''); // Valor padrão para evitar undefined
    const [look, setLook] = useState(data.look === 0 ? false : true);
    const [hours_down, setHours_down] = useState(data.hours_down || ''); // Valor padrão para evitar undefined
    const [code, setCode] = useState(data.code || ''); // Valor padrão para evitar undefined
    const [amount, setAmount] = useState(data.amount || ''); // Valor padrão para evitar undefined
    const [pallet_rack, setPalletRack] = useState(data.pallet_rack || ''); // Valor padrão para evitar undefined
  
    useEffect(() => {
        setCompany(data.company || '')
        setLook(data.look === 0 ? false : true)
        setHours_down(data.hours_down || '')
        setCode(data.code || '')
        setAmount(data.amount || '')
        setPalletRack(data.pallet_rack || '')
    }, [data]);

    const handleCheckBoxChange = (option) => {
        setCompany(option);
    }

    const handleCheckLook = () => {
        setLook(!look);
    }

    const handleCheckHoursDown = () => {
        if (hours_down !== '') {
            setHours_down('')
            return
        }

        const currentTime = format(new Date(), 'HH:mm:ss');
        setHours_down(currentTime);
    }

    async function handleUpdateRow(e) {
        e.preventDefault()

        if(company === 'Gtex' && amount === '') {
            return alert('Campo quantidade obrigatório quando a empresa é Gtex')
        }

        try {
            const response = await api.put(`/pieces/${data.id}`, {code, pallet_rack, company, look, hours_down, amount})
            document.querySelector('.loader-update').classList.add('true')
            isUpdate()
        
            setTimeout(() => {
                document.querySelector('.loader-update').classList.remove('true')

                onClick()
            }, 2000)

        } catch (error) {
            console.error(error)
            return alert('Não foi possível atualizar os dados')
        }
       
        
    }

    async function handleDeleteRow(e) {
        e.preventDefault()

        try {
            const response = await api.delete(`/pieces/${data.id}`)
            document.querySelector('.loader-update').classList.add('true')
            isUpdate()
        
            setTimeout(() => {
                document.querySelector('.loader-update').classList.remove('true')

                onClick()
            }, 2000)

        } catch (error) {
            console.error(error)
            return alert('Não foi possível deletar os dados')
        }   
    }

    return (
        <div
            data-open-update={openUpdate}
            className="update shadow-lg"
        >
            <div className="w-full grid p-2 bg-cyan-600 mb-4">
                <div className="justify-self-end flex items-center gap-2">
                    <small>Fechar modal</small>
                    <CiCircleRemove onClick={onClick} size={28} className="hover:scale-110 cursor-pointer" />
                </div>
            </div>

            <form className="pl-14 pr-14 flex flex-col gap-12">
                <div className="xl:grid xl:grid-cols-3 xl:gap-14 xl:items-center xl:justify-between   flex flex-col gap-8">
                    <div className="flex flex-col gap-4">
                        <label htmlFor="code_update" className="flex flex-col gap-1">
                            <small>Código</small>
                            <input
                                type="text"
                                id="code_update"
                                value={code}
                                onChange={e => setCode(e.target.value)}
                                className="h-8 outline-none border-b border-cyan-600 pl-2" />
                        </label>

                        <label htmlFor="pallet_rack_update" className="flex flex-col gap-1">
                            <small>Porta Palete</small>
                            <input
                                type="text"
                                id="pallet_rack_update"
                                value={pallet_rack}
                                onChange={e => setPalletRack(e.target.value)}
                                className="h-8 outline-none border-b border-cyan-600 pl-2" />
                        </label>
                    </div>

                    <fieldset className="flex flex-col gap-2">
                        <label htmlFor="patral_update" className="flex gap-2">
                            <input
                                type="checkbox"
                                id="patral_update"
                                checked={company === 'Patral'}
                                onChange={() => handleCheckBoxChange('Patral')}
                                className="cursor-pointer" /> PATRAL
                        </label>

                        <label htmlFor="gtex_update" className="flex gap-2">
                            <input
                                type="checkbox"
                                id="gtex_update"
                                checked={company === "Gtex"}
                                onChange={() => handleCheckBoxChange('Gtex')}
                                className="cursor-pointer" /> GTEX
                        </label>

                        <label htmlFor="amount_update" className="flex flex-col gap-1">
                            <small>Quantidade {company === 'Gtex' ? '(Obrigatório)' : '(Opcional)'}</small>
                            <input
                                type="text"
                                id="amount_update"
                                required={company === 'Gtex'}
                                value={amount}
                                onChange={e => setAmount(e.target.value)}
                                className="h-8 outline-none border-b border-cyan-600 pl-2" />
                        </label>
                    </fieldset>

                    <div className="flex flex-col items-start gap-4">
                        <div className="flex items-center gap-4">
                            <small>Horas que desceu</small>
                            {hours_down === '' ?
                                <FiCircle size={28} cursor="pointer" className="text-cyan-600 hover:scale-110" onClick={handleCheckHoursDown} /> :
                                <CiClock1 size={28} cursor="pointer" className="text-cyan-600 hover:scale-110" onClick={handleCheckHoursDown} />
                            }

                        </div>

                        <div className="flex items-center gap-4">
                            <small>Check como visto</small>
                            {look === false ?
                                <FiCircle size={28} cursor="pointer" className="text-cyan-600 hover:scale-110" onClick={handleCheckLook} /> :
                                <CiCircleCheck size={28} cursor="pointer" className="text-cyan-600 hover:scale-110" onClick={handleCheckLook} />
                            }

                        </div>
                    </div>
                </div>

                <div className="flex justify-end items-center gap-14 p-3 ">
                    <div className="loader-update"></div>
                    <button
                        onClick={handleDeleteRow}
                        className="justify-self-end bg-red-500 p-2 shadow-lg hover:bg-red-400"
                    >

                        Deletar Linha
                    </button>

                    <button
                        type="submit"
                        onClick={handleUpdateRow}
                        className="justify-self-end bg-cyan-600 p-2 shadow-lg hover:bg-cyan-500">
                        Atualizar Linha
                    </button>
                </div>
            </form>
        </div>
    )
}
