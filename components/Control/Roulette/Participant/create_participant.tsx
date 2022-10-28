import { Dialog, Transition } from "@headlessui/react"
import { Fragment, useState } from "react"
import { RiLoader5Fill } from "react-icons/ri"
import { Dialog as _Dialog } from '../../../'
import { useContext } from 'react'
import { ControlWs } from '../../../../lib'
interface props {
    open: boolean,
    closeModal: () => void,
    rouletteID: string,
    _get_roulette_data: () => void
}
export default function NewParticipant({ open, closeModal, rouletteID, _get_roulette_data }: props) {
    const socket = useContext(ControlWs)
    const [participant, setParticipant] = useState({
        userid: '',
        isLoading: false
    })
    const [dialog, setDialog] = useState({
        open: false,
        title: '',
        message: '',
        icon: 'success'
    })
    const save = async () => {
        if (participant.userid) {
            try {
                setParticipant({ ...participant, isLoading: true })
                await fetch('/api/control/roulette/new_participant', {
                    method: 'post',
                    headers: {
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify({ userid: participant.userid, rouletteid: rouletteID })
                }).then(async (req) => {
                    if (req.ok) {
                        const { status, title, message } = await req.json()
                        // show modal
                        setDialog({ ...dialog, open: true, title: title, message: message, icon: status ? 'success' : 'error' })
                        setParticipant({ ...participant, isLoading: false, userid: status ? '' : participant.userid })
                        //participant successfully added 
                        if (status) {
                            _get_roulette_data()
                            socket.emit("new-roulette-participant", { id: rouletteID })
                        }
                    } else {
                        throw new Error(`${req.status} ${req.statusText}`)
                    }
                })
            } catch (e) {
                //show modal
                setDialog({ ...dialog, open: true, title: 'Connection Error', message: e.message, icon: 'error' })
                setParticipant({ ...participant, isLoading: false })
            }
        }
    }
    return (
        <>
            <Transition appear show={open} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={closeModal}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0">
                        <div className="fixed inset-0 bg-black/70" />
                    </Transition.Child>
                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95">
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-gray-900 dark:text-zinc-300" >
                                        Add New Participant
                                    </Dialog.Title>
                                    <div className='flex flex-col gap-2 mt-5'>
                                        <input
                                            onKeyPress={(e) => e.key === "Enter" && save()}
                                            disabled={participant.isLoading}
                                            value={participant.userid}
                                            onInput={(e) => setParticipant({ ...participant, userid: e.currentTarget.value })}
                                            placeholder='Enter User ID'
                                            className='dark:bg-zinc-800 px-4 py-3 disabled:cursor-not-allowed rounded-lg dark:text-zinc-300 shadow-lg outline-none dark:focus:ring-teamdao-primary focus:ring-1 transition-all' />
                                    </div>
                                    <div className="flex w-full mt-4">
                                        <button
                                            disabled={participant.isLoading}
                                            onClick={save}
                                            type="button"
                                            className="w-full dark:disabled:bg-teamdao-primary/70 disabled:cursor-not-allowed flex justify-center items-center rounded-md border border-transparent bg-blue-100 dark:bg-teamdao-primary dark:text-black px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2">
                                            {participant.isLoading ? <RiLoader5Fill className='animate-spin w-6 h-6' /> : 'Save'}
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
            <_Dialog
                open={dialog.open}
                onClose={() => setDialog({ ...dialog, open: false })}
                title={dialog.title}
                message={dialog.message}
                backdrop={false}
                showCancelButton={true}
                icon={dialog.icon} />
        </>
    )
}