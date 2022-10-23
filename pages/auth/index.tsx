import Head from 'next/head'
import { useEffect, useState } from 'react'
import { FaLock } from 'react-icons/fa'
import { RiLoader5Fill } from 'react-icons/ri'
import { Dialog } from '../../components'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
export default function Auth() {
    const router = useRouter()
    const { status } = useSession()
    const [data, setData] = useState({
        username: undefined,
        password: undefined,
        isLoading: false,
        dialog: {
            open: false,
            title: '',
            message: '',
            icon: '',
            backdrop: true,
            loader: false,
            showCancelButton: false,
            showConfirmButton: true
        }
    })
    const login = async (): Promise<void> => {
        if (data.username && data.password && !data.isLoading) {
            setData({ ...data, isLoading: true, dialog: { ...data.dialog, open: true } })
            try {
                await signIn('credentials', {
                    redirect: false,
                    callbackUrl: '/control',
                    username: data.username,
                    password: data.password
                }).then((res) => {
                    if (res.ok) {
                        setData({
                            ...data,
                            isLoading: false,
                            dialog: {
                                ...data.dialog,
                                open: true,
                                icon: 'success',
                                title: 'Authenticated Successfully',
                                message: 'Redirecting...',
                                backdrop: false,
                                loader: true,
                                showCancelButton: false,
                                showConfirmButton: false
                            }
                        })
                        setTimeout(() => {
                            router.push(res.url)
                        }, 2000)
                    } else {
                        setData({
                            ...data,
                            isLoading: false,
                            dialog: {
                                ...data.dialog,
                                open: true,
                                icon: 'error',
                                title: 'Opsss',
                                message: '401 Unauthorized',
                                backdrop: true,
                                showConfirmButton: false,
                                showCancelButton: true
                            }
                        })
                    }
                })
            } catch (e: any) {
                setData({
                    ...data,
                    isLoading: false,
                    dialog: {
                        ...data.dialog,
                        open: true,
                        title: 'Connection Error',
                        message: e.message
                    }
                })
            }
        }
    }
    useEffect(() => {
        if (status === 'authenticated') {
            setData({
                ...data,
                isLoading: false,
                dialog: {
                    ...data.dialog,
                    open: true,
                    icon: 'success',
                    title: 'Authenticated Successfully',
                    message: 'Redirecting...',
                    backdrop: false,
                    loader: true,
                    showCancelButton: false,
                    showConfirmButton: false
                }
            })
            setTimeout(() => {
                router.push('/control')
            }, 2000)
        }
    }, [status, setData])
    return (
        <>
            <Head>
                <title>TEAMDAO Authentication</title>
            </Head>
            <div className='flex justify-center items-center h-screen w-screen p-5 md:p-14 transition-all'>
                {status !== 'loading' && (
                    <div className="animate__animated animate__fadeInUp ms-200 translucent flex w-full md:w-[400px] items-center justify-center py-10 px-10 rounded-lg dark:bg-zinc-800">
                        <div className="w-full max-w-md space-y-8">
                            <div>
                                <img
                                    className="mx-auto h-36 w-36"
                                    src="/assets/images/logo.png"
                                    alt="logo"
                                />
                                <h2 className="mt-6 text-center text-3xl font-bold tracking-tight dark:text-zinc-300">
                                    Authentication
                                </h2>
                            </div>
                            <div className="mt-8 space-y-6">
                                <div className="-space-y-px rounded-md shadow-sm">
                                    <div>
                                        <input
                                            onKeyPress={(e) => e.key === 'Enter' && data.username && data.password && !data.isLoading && login()}
                                            onInput={(e) => setData({ ...data, username: e.currentTarget.value })}
                                            name="usernmae"
                                            type="text"
                                            autoComplete="text"
                                            required
                                            className="relative block w-full appearance-none dark:bg-zinc-800 rounded-none rounded-t-md border border-gzinc-400 px-3 py-2 text-gray-900 dark:text-zinc-300 placeholder-gray-500 dark:placeholder-zinc-400 focus:z-10 focus:border-teamdao-primary focus:outline-none focus:ring-teamdao-primary sm:text-sm"
                                            placeholder="Username"
                                        />
                                    </div>
                                    <div>
                                        <input
                                            onKeyPress={(e) => e.key === 'Enter' && data.username && data.password && !data.isLoading && login()}
                                            onInput={(e) => setData({ ...data, password: e.currentTarget.value })}
                                            name="password"
                                            type="password"
                                            autoComplete="current-password"
                                            required
                                            className="relative block w-full appearance-none dark:bg-zinc-800 rounded-none rounded-b-md border border-gzinc-400 px-3 py-2 text-gray-900 dark:text-zinc-300 placeholder-gray-500 dark:placeholder-zinc-400 focus:z-10 focus:border-teamdao-primary focus:outline-none focus:ring-teamdao-primary sm:text-sm"
                                            placeholder="Password"
                                        />
                                    </div>
                                </div>
                                <div className='pb-5'>
                                    <button
                                        onClick={() => data.username && data.password && !data.isLoading && login()}
                                        disabled={!data.username || !data.password || data.isLoading}
                                        type="button"
                                        className="group disabled:cursor-not-allowed dark:disabled:bg-teamdao-secondary relative flex w-full justify-center rounded-md border border-transparent bg-teamdao-primary/90 py-2 px-4 text-sm font-bold text-white dark:text-black hover:bg-indigo-700 dark:hover:bg-teamdao-primary focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-teamdao-primary focus:ring-offset-2 dark:focus:ring-offset-zinc-800">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                            {data.isLoading ? <RiLoader5Fill className="h-5 w-5 animate-spin text-white" aria-hidden="true" /> : <FaLock className="h-5 w-4 text-black group-hover:text-black" aria-hidden="true" />}
                                        </span>
                                        Sign in
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {status === 'loading' && (
                    <div className='animate__animated animate__fadeInDown ms-200 md:w-[400px] w-full dark:bg-zinc-900 flex flex-col justify-center items-center p-5 rounded-lg shadow-lg'>
                        <RiLoader5Fill className='w-10 h-10 text-teal-600 animate-spin' />
                    </div>
                )}
            </div>
            <Dialog
                showConfirmButton={true}
                showCancelButton={data.dialog.showCancelButton}
                loader={data.dialog.loader}
                backdrop={data.dialog.backdrop}
                icon={data.dialog.icon}
                open={data.dialog.open}
                title={data.dialog.title}
                message={data.dialog.message}
                onClose={() => data.dialog.backdrop && setData({ ...data, dialog: { ...data.dialog, open: false } })} />
        </>
    )
}
