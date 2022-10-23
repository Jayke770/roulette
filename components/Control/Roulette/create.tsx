import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import { RiLoader5Fill } from 'react-icons/ri'
import { Dialog as _Dialog } from '../../'
export default function CreateRoulette({ open, closeModal }) {
    const [create, setCreate] = useState({
        autoStart: false,
        name: '',
        prize: '',
        startDate: '',
        isLoading: false
    })
    const [dialog, setDialog] = useState({
        open: false,
        title: '',
        message: '',
        icon: 'success'
    })
    const createRoulette = async () => {
        if (create.name && create.prize) {
            setCreate({ ...create, isLoading: true })
            try {
                await fetch('/api/control/roulette/create', {
                    method: 'post',
                    headers: {
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify({ autoStart: create.autoStart, raffleName: create.name, rafflePrize: create.prize, raffleDate: create.startDate })
                }).then(async (req) => {
                    if (req.ok) {
                        const { status, title, message } = await req.json()
                        //show modal
                        setDialog({ ...dialog, open: true, title: title, message: message, icon: status ? 'success' : 'error' })
                        setCreate({ ...create, isLoading: false })
                    } else {
                        throw new Error(`${req.status} ${req.statusText}`)
                    }
                }).catch((e) => {
                    throw new Error(e.message)
                })
            } catch (e) {
                //show modal
                setDialog({ ...dialog, open: true, title: 'Connection Error', message: e.message, icon: 'error' })
                setCreate({ ...create, isLoading: false })
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
                                        Create New Roulette
                                    </Dialog.Title>
                                    <div className='flex flex-col gap-2 mt-5'>
                                        <input
                                            onInput={(e) => setCreate({ ...create, name: e.currentTarget.value })}
                                            disabled={create.isLoading}
                                            placeholder='Raffle Name'
                                            className='dark:bg-zinc-800 px-4 py-3 disabled:cursor-not-allowed rounded-lg dark:text-zinc-300 shadow-lg outline-none dark:focus:ring-teamdao-primary focus:ring-1 transition-all' />
                                        <textarea
                                            onInput={(e) => setCreate({ ...create, prize: e.currentTarget.value })}
                                            disabled={create.isLoading}
                                            placeholder='Raffle Prize'
                                            className='dark:bg-zinc-800 border-none resize-none px-4 py-3 disabled:cursor-not-allowed rounded-lg dark:text-zinc-300 shadow-lg outline-none dark:focus:ring-teamdao-primary focus:ring-1 transition-all' />
                                        {create.autoStart && (
                                            <div className='w-full flex flex-col gap-2'>
                                                <span className='animate__animated  animate__fadeInRight ms-300 dark:text-zinc-400'>Staring Date & Time</span>
                                                <input
                                                    onInput={(e) => setCreate({ ...create, startDate: e.currentTarget.value })}
                                                    disabled={create.isLoading}
                                                    className='animate__animated animate__fadeInLeft ms-300 disabled:cursor-not-allowed border-none dark:bg-zinc-800 px-4 py-3 rounded-lg dark:text-zinc-300 shadow-lg outline-none dark:focus:ring-teamdao-primary focus:ring-1 transition-all'
                                                    type={'datetime-local'} />
                                            </div>
                                        )}
                                        <div className='flex justify-between items-center mt-1'>
                                            <span className='font-normal text-base'>Auto Start Raffle</span>
                                            <div className='flex justify-center items-center'>
                                                <input
                                                    disabled={create.isLoading}
                                                    onChange={() => setCreate({ ...create, autoStart: !create.autoStart })}
                                                    type={'checkbox'}
                                                    className="rounded transition-all cursor-pointer disabled:cursor-not-allowed" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex w-full mt-4">
                                        <button
                                            disabled={create.isLoading}
                                            onClick={createRoulette}
                                            type="button"
                                            className="w-full dark:disabled:bg-teamdao-primary/70 disabled:cursor-not-allowed flex justify-center items-center rounded-md border border-transparent bg-blue-100 dark:bg-teamdao-primary dark:text-black px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2">
                                            {create.isLoading ? <RiLoader5Fill className='animate-spin w-6 h-6' /> : 'Create Roulette'}
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
