import { Header, Modal, Sidebar, Information } from '@/components/shared';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="w-full h-screen flex items-start overflow-hidden">
            <Sidebar />
            <div className="w-full h-full flex flex-col">
                <Header />
                <main className="w-full flex-1 bg-secondary flex items-start justify-center">{children}</main>
            </div>
            <div>
                <Information />
            </div>
        </div>
    );
}
