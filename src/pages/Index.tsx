import { Helmet } from 'react-helmet-async';
import PhotoboothApp from '@/components/photobooth/PhotoboothApp';

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Photobooth - Ambil Foto Selfie Terbaik Anda</title>
        <meta name="description" content="Aplikasi photobooth web dengan filter dan bingkai keren. Ambil foto dari webcam, edit dengan berbagai efek, lalu unduh atau cetak hasilnya." />
      </Helmet>
      <PhotoboothApp />
    </>
  );
};

export default Index;
