import Head from "next/head"
import { ControlCreateRoulette, ControlMain, ControlNavbar, ControlRouletteCard, ManLoader } from "../../../components"
import { FaPlus } from 'react-icons/fa'
import Link from "next/link"
import { useState } from 'react'
import { ControlRoulettes } from "../../../lib"

export default function Roulettes() {
    const [createModal, setCreateModal] = useState(false)
    const { roulettes } = ControlRoulettes()
    return (
        <>
            <Head>
                <title>Roulettes</title>
            </Head>
            <ControlNavbar page={'Roulettes'} />
            <ControlMain>
                <div className="flex flex-col gap-3 p-2 md:p-0 !pb-40">
                    <div className="flex justify-between items-center w-full">
                        <div className="flex items-center">
                            <input
                                type={'search'}
                                placeholder="Search"
                                className="bg-zinc-800 rounded-lg border-none transition-all outline-none dark:focus:ring-teamdao-primary font-normal" />
                        </div>
                        <div className="flex items-center">
                            <button
                                onClick={() => setCreateModal(true)}
                                className="bg-teamdao-primary/80 transition-all hover:bg-teamdao-primary px-4 py-2 dark:text-black rounded-lg shadow-lg font-semibold text-base">
                                <div className="flex gap-2 items-center py-1 md:py-0">
                                    <FaPlus className="w-4 h-4" />
                                    <span className="hidden md:block transition-all">New Roulette</span>
                                </div>
                            </button>
                        </div>
                    </div>
                    <div className="transition-all grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                        {roulettes ? (
                            roulettes.length > 0 ? (
                                roulettes.map((x, i: number) => (
                                    <Link key={i} href={`/control/roulettes/${x.id}`} passHref>
                                        <a>
                                            <ControlRouletteCard
                                                title={x.name}
                                                participants={x.participants.length}
                                                prize={x.prize}
                                                status={x.isDone}
                                                key={i} />
                                        </a>
                                    </Link>
                                ))
                            ) : (
                                <span>empty</span>
                            )
                        ) : <ManLoader />}
                    </div>
                </div>
            </ControlMain>
            <ControlCreateRoulette
                open={createModal}
                closeModal={() => setCreateModal(false)} />
        </>
    )
}