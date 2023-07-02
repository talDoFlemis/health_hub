import Head from 'next/head'
import DashboardLayout from '@/layouts/DashboardLayout' 
import type { NextPageWithLayout } from './_app'
import { ReactElement } from 'react'

const Home: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Health Hub</title>
      </Head>
      <main>
        index page
      </main> 
    </>
  )
}

Home.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>
}

export default Home
