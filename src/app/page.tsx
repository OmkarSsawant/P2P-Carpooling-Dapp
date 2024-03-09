'use client'
import CustSupportSvg from '@/components/cust-sup-svg';
import Earn from '@/components/earn-svg';
import FlexHoursSvg from '@/components/flex-hours-svg';
import { P2PCabNavBar } from '@/components/nav-bar'
import { NumberIcon } from '@/components/number-icon';

import DriverRegisterer from '@/components/register-driver'
import {  Button, Spacer, Card, Image , NextUIProvider, CardHeader, CardBody, Divider } from '@nextui-org/react';
import Head from 'next/head';
function App() {
  
  const handleGetStarted = () => {
    // Add your logic for getting started button click
  };
  return (    
    <>
         
         <NextUIProvider>
      <P2PCabNavBar pageIndex={0}/>
      <>
      <Head>
        <title>Peer Cab</title>
      </Head>
      <div className="container">
        <div className="grid grid-cols-2 m-16">
<div className="s1">

        <Spacer y={4} />
        < h1 className='text-6xl font-black text-gray-900 dark:text-white'> PeerCab : Rides Made Easy & Safe</h1>
        <Spacer y={12} />
        <p className='text-3xl font-medium text-gray-170 dark:text-white'>
          Welcome to our platform where you can share rides with others along your route,
          making commuting more efficient and environmentally friendly.
        </p>
        <Spacer y={2} />
        </div>
    <div className="s2">
      <Image src='assets/p2pcp.png' alt='ride share image'/>
    </div>
        </div>
        
        <Spacer y={4} />
        <div className="m-16 ">
        <h2 className='text-6xl font-black text-gray-900 dark:text-white'>Why Choose Us?</h2>
        <Spacer y={2} />
        <div className="grid grid-cols-3 gap-16">
        <Card>
          <Image
          className='m-8'

            src="/assets/secure.jpg" 
            alt="Safety Icon"
            width={170}
          />
          <CardHeader className='font-semibold text-foreground/90'>Safety First</CardHeader>
          <CardBody>
            Our platform ensures a secure and reliable carpooling experience. Only verified drivers
            with positive reviews are allowed to offer rides.
          </CardBody>
        </Card>
        <Spacer y={2} />
        <Card>
          <Image
          className='m-8'
            src="/assets/cab_search.jpg" // Prompt: "convenient carpooling"
            alt="Convenience Icon"
            width={170}
          />
          <CardHeader className='font-semibold text-foreground/90'>Convenience</CardHeader>
          <CardBody>
            With our smart matching algorithm, find rides that perfectly fit your route and schedule,
            making your commute hassle-free.
          </CardBody>
        </Card>
        <Spacer y={2} />
        <Card>
          <Image
          className='m-2'

            src="/assets/env-frnd.jpg" // Prompt: "environmentally friendly carpooling"
            alt="Environment Icon"
            width={170}
          />
          <CardHeader className='font-semibold text-foreground/90'>Environmentally Friendly</CardHeader>
          <CardBody>
            By sharing rides, you're reducing carbon emissions and helping to create a greener planet.
          </CardBody>
        </Card>
        </div>
      </div>
      </div> 
      
      <section className='m-8 '>
      <h2 className='text-6xl font-black text-gray-900 dark:text-white'>How PeerCab Works</h2>
      <Spacer y={4} />
     <div className="d grid grid-cols-4 gap-2">
      {[{"num":1,"title":"Register Ride","desc":" A Rider interested to request commutes in ride can register a ride"},
      {"num":2,"title":"Find a Ride","desc":"With Platforms easy search you can find rides on same route "},
      {"num":3,"title":"Book","desc":"A commute books ride and that ride is confirmed by rider and ride is confirmed"},
      {"num":4,"title":"Complete Ride","desc":" A Ride is completed and safe payment is confirmed by commute"}
    ].map(({num,title,desc}) => <>
     <Card className="max-w-[400px]">
      <CardHeader className="flex gap-3">
        <NumberIcon num={num}/>
        <div className="flex flex-col">
          <p className="text-md">{title}</p>
          <p className="text-small text-default-500">{desc}</p>
        </div>
      </CardHeader>
      <Divider/>
      <CardBody>
        <p>{desc}</p>
      </CardBody>
      <Divider/>
      
    </Card>
    </>)}
    </div>
      </section>
      <Spacer y={4} />
    </>
    <section className='m-8 '>
    <h2 className='text-6xl font-black text-gray-900 dark:text-white'>Key Benefits</h2>
      <Spacer y={4} />
      <Benefit n='01.' title='Flexible Working Hours' desc='You decide when and how much time to drive' img={<FlexHoursSvg/>}/>
      <Benefit n='02.' title='Earn' desc='By Driving with PeerCab you can earn more' img={<Earn/>}/>
      <Benefit n='03.' title='Quick Resolve Issue' desc='A Immutable contracts are maintained .Easy review your transactions' img={<CustSupportSvg/>}/>

</section>
<Spacer y={4} />
        <div className="bg-gray-900 p-8 rounded-lg">
          <h2 className="text-3xl font-bold text-white">Contact Us</h2>
          <p className="text-lg text-gray-300 mt-4">Have questions or suggestions? Feel free to reach out to us.</p>
          <div className="flex items-center mt-6">
            <Image src="/images/email-icon.png" alt="Email Icon" width={24} height={24} />
            <p className="ml-2 text-lg text-gray-300">contact@peercab.com</p>
          </div>
          <div className="flex items-center mt-2">
            <Image src="/images/phone-icon.png" alt="Phone Icon" width={24} height={24} />
            <p className="ml-2 text-lg text-gray-300">+91 9876543210</p>
          </div>
        </div>
      
      </NextUIProvider>
    </>
  )
}

type BProps = {
  n:string,
  title:string,
  desc:string,
  img:React.ReactNode,
}

function Benefit({n,title,desc,img}:BProps){
  return (
  <>
    <Spacer y={4} />
  <div className="grid grid-cols-3">
  <div className="col-span-2">
    
      
    
    <div >
      <div className="flex">
        <h1 className='text-6xl font-black text-green-500 light:text-green'>{n}</h1>
        <h3 className='text-2xl font-black text-gray-900 dark:text-white'>{title}</h3>
      </div>
      <div>
        <p>{desc}</p>

      </div>
    </div>
  </div>
  <div>
    {img}
  </div>
</div>
    <Spacer y={4} />
</>

);
}
export default App
