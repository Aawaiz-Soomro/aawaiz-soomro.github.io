import React from 'react'

export default function Container({ children }: { children: React.ReactNode }) {
    return (
        <div className="mx-auto max-w-6xl xl:max-w-7xl 2xl:max-w-[1600px] px-5 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
            {children}
        </div>
    )
}