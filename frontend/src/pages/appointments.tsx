import Head from 'next/head'
import DashboardLayout from '@/layouts/DashboardLayout'
import type { NextPageWithLayout } from './_app'
import { ReactElement } from 'react'

const Appointments: NextPageWithLayout = () => {
    return (
        <>
            <Head>
                <title>Health Hub - Consultas</title>
            </Head>
            <main>

            </main>
        </>
    )
}

Appointments.getLayout = function getLayout(page: ReactElement) {
    return <DashboardLayout>{page}</DashboardLayout>
}

export default Appointments