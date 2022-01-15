import { BsShieldFillCheck } from 'react-icons/bs'
import { BiSearchAlt } from 'react-icons/bi'
import { RiHeart2Fill } from 'react-icons/ri'

interface ServiceCardProps {
  color: string
  title: string
  icon: JSX.Element
  subtitle: string
}

const ServiceCard = ({ color, title, icon, subtitle }: ServiceCardProps) => (
  <div className='flex flex-row justify-start items-center white-glassmorphism p-3 m-2 cursor-pointer hover:shadow-xl max-w-lg'>
    <div
      className={`w-10 h-10 rounded-full flex justify-center items-center ${color}`}
    >
      {icon}
    </div>
    <div className='ml-5 flex flex-col flex-1'>
      <h3 className='mt-1 text-white text-lg'>{title}</h3>
      <p className='my-2 text-white text-sm md:w-5/6'>{subtitle}</p>
    </div>
  </div>
)

export const Services = () => {
  return (
    <div className='flex flex-col mf:flex-row w-full justify-center items-center gradient-bg-services'>
      {/* HERO */}
      <div className='flex mf:flex-row flex-col items-center justify-between md:p-16 my-12 px-4 sm:p-10'>
        <div className='flex-1 flex flex-col justify-start items-start'>
          <h1 className='text-white text-3xl sm:text-5xl py-2 text-gradient'>
            Services that we <br /> continue to improve
          </h1>
        </div>
      </div>
      {/* SERVICE CARDS */}
      <div className='flex flex-col justify-start items-center px-4'>
        <ServiceCard
          color='bg-[#2952e3]'
          title='Security Guaranteed'
          icon={<BsShieldFillCheck fontSize={21} className='text-white' />}
          subtitle='Security is guarenteed. We always maintain privacy and maintain the quality of our products.'
        />
        <ServiceCard
          color='bg-[#8945f8]'
          title='Best Exchange Rates'
          icon={<BiSearchAlt fontSize={21} className='text-white' />}
          subtitle='Security is guarenteed. We always maintain privacy and maintain the quality of our products.'
        />
        <ServiceCard
          color='bg-[#f84550]'
          title='Fastest Transactions'
          icon={<RiHeart2Fill fontSize={21} className='text-white' />}
          subtitle='Security is guarenteed. We always maintain privacy and maintain the quality of our products.'
        />
      </div>
    </div>
  )
}
