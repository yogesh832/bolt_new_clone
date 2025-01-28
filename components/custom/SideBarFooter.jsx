import { HelpCircle, LogOut, Settings, Wallet } from 'lucide-react'
import React from 'react'
import { Button } from '../ui/button'

function SideBarFooter() {
    const options = [
        {
            name: "Settings",
            icon: Settings
        },
        {
            name: "Help Center",
            icon: HelpCircle
        },
        {
            name: "My Subscription",
            icon: Wallet
        },
        {
            name: "Sign out",
            icon: LogOut
        },
    ]

    return (
        <div className='p-2 mb-10'>
            {options.map((option, index) => (
                <Button variant="ghost" className="w-full flex justify-start my-3" key={index} >
                    <option.icon size={20} />
                    <span>{option.name}</span>
                </Button>
            ))}
        </div>
    )
}

export default SideBarFooter
