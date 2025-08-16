import type { PropsWithChildren } from "react";


export default function ErrorMessage({ children }: PropsWithChildren) {
  return (
    <p className='bg-red-500 text-white p-2 rounded font-bold text-center text-sm'>
        {children}
    </p>
  )
}
