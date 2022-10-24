import { Transition, Dialog, Tab, Switch } from "@headlessui/react"
import { Fragment, useState } from "react"
import { RiLoader5Fill } from "react-icons/ri"
import _Dialog from "../../../Dialog"
import Swal from 'sweetalert2'
import { Socket } from "socket.io-client"
type RouletteSettings = {
    open: boolean,
    closeModal: () => void,
    get_roulette_data: () => void,
    roulette: {
        id: string,
        autoStart: boolean,
        name: string,
        prize: string,
        StartDate: string,
        startRoulette: boolean,
        maxParticipants: number,
        isDone: boolean,
        participants: {
            id: string,
            userid: string,
            created: string
        }[],
        created: string
    },
    socket: Socket
}
export default function RouletteSettings({ open, closeModal, roulette, get_roulette_data, socket }: RouletteSettings) {
    const [tab, setTab] = useState('info')
    const [rouletteSettings, SetRouletteSettings] = useState({
        isLoading: false
    })
    const [dialog, setDialog] = useState({
        open: false,
        title: '',
        message: '',
        icon: 'success'
    })
    const start_roulette = () => {
        if (!roulette.startRoulette && !rouletteSettings.isLoading) {
            Swal.fire({
                icon: 'question',
                title: 'Start Roulette',
                text: 'Are you sure you want to start this roulette.',
                backdrop: true,
                allowOutsideClick: false,
                confirmButtonText: 'Yes',
                showDenyButton: true,
                reverseButtons: true,
                position: 'bottom',
                showClass: {
                    backdrop: '!p-0 bg-black/80',
                    popup: 'animate__animated animate__fadeInUp ms-300'
                },
                hideClass: {
                    backdrop: '!p-0 bg-black/80',
                    popup: 'animate__animated animate__fadeOutDown ms-300'
                }
            }).then((a) => {
                if (a.isConfirmed) {
                    SetRouletteSettings({ ...rouletteSettings, isLoading: true })
                    Swal.fire({
                        toast: true,
                        backdrop: true,
                        allowOutsideClick: false,
                        showConfirmButton: false,
                        title: 'Starting Roulette',
                        position: 'bottom-right',
                        showClass: {
                            popup: 'animate__animated animate__fadeInUp ms-300'
                        },
                        hideClass: {
                            popup: 'animate__animated animate__fadeOutDown ms-300'
                        },
                        willOpen: () => {
                            Swal.showLoading()
                            try {
                                //start roulette 
                                socket.emit('start-roulette', { id: roulette.id }, (res: { status: boolean, title: string, message: string }) => {
                                    SetRouletteSettings({ ...rouletteSettings, isLoading: false })
                                    Swal.fire({
                                        toast: true,
                                        icon: res.status ? 'success' : 'info',
                                        backdrop: true,
                                        timer: 2000,
                                        timerProgressBar: true,
                                        allowOutsideClick: false,
                                        showConfirmButton: false,
                                        title: res.title,
                                        position: 'bottom-right',
                                        showClass: {
                                            popup: 'animate__animated animate__fadeInUp ms-300'
                                        },
                                        hideClass: {
                                            popup: 'animate__animated animate__fadeOutDown ms-300'
                                        },
                                    })
                                })
                            } catch (e) {
                                SetRouletteSettings({ ...rouletteSettings, isLoading: true })
                                setDialog({ ...dialog, open: true, title: 'Connection Error', message: e.message, icon: 'error' })
                            }
                        },
                    })
                }
            })
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
                                        Roulette Settings
                                    </Dialog.Title>
                                    <div className="w-full max-w-md px-2 py-5 sm:px-0">
                                        <Tab.Group>
                                            <Tab.List className="flex gap-1 space-x-1 rounded-xl bg-zinc-800 p-1">
                                                <Tab
                                                    onClick={() => setTab('info')}
                                                    className={`w-full ${tab === 'info' ? 'dark:bg-teamdao-primary dark:text-black' : 'bg-transparent'} transition-all rounded-lg py-2.5 text-sm font-medium leading-5 ring-white dark:ring-teamdao-primary ring-opacity-60 ring-offset-2 ring-offset-blue-400  dark:ring-offset-zinc-800 focus:outline-none focus:ring-2`}>
                                                    Information
                                                </Tab>
                                                <Tab
                                                    onClick={() => setTab('settings')}
                                                    className={`w-full ${tab === 'settings' ? 'dark:bg-teamdao-primary dark:text-black' : 'bg-transparent'} transition-all rounded-lg py-2.5 text-sm font-medium leading-5 ring-white dark:ring-teamdao-primary ring-opacity-60 ring-offset-2 ring-offset-blue-400  dark:ring-offset-zinc-800 focus:outline-none focus:ring-2`}>
                                                    Settings
                                                </Tab>
                                            </Tab.List>
                                            <Tab.Panels className="mt-2 p-2">
                                                {tab === 'info' && (
                                                    <div className="flex flex-col gap-2">
                                                        <div className="flex gap-2 justify-between items-center dark:bg-zinc-800 px-4 py-3 shadow-md rounded-md">
                                                            <span>Start Roulette</span>
                                                            <Switch
                                                                checked={roulette.startRoulette}
                                                                onChange={start_roulette}
                                                                className={`${roulette.startRoulette ? 'bg-blue-600 dark:bg-green-primary' : 'bg-gray-200 dark:bg-zinc-900'} relative inline-flex h-6 w-11 items-center rounded-full`}>
                                                                <span
                                                                    className={`${roulette.startRoulette ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition`} />
                                                            </Switch>
                                                        </div>
                                                    </div>
                                                )}
                                                {tab === 'settings' && (
                                                    <div className="flex gap-2 items-center dark:bg-zinc-800 px-4 py-3 shadow-md rounded-md">
                                                        fsafjasfks
                                                    </div>
                                                )}
                                            </Tab.Panels>
                                        </Tab.Group>
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