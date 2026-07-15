import ClientPage from './ClientPage';

export function generateStaticParams() {
  return [{ id: 'dummy' }];
}

export default function Page({ params }: { params: any }) {
  return <ClientPage params={params} />;
}
