import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface ImageRendererProps {
    imageUrl: string;
}

const ImageRenderer: React.FC<ImageRendererProps> = ({ imageUrl }) => {
    const [imageData, setImageData] = useState<string | null>(null);

    useEffect(() => {
        const fetchImageData = async () => {
            try {
                const response = await axios.get(imageUrl, {
                    responseType: 'arraybuffer',
                });
                const base64Image = Buffer.from(response.data, 'binary').toString('base64');
                setImageData(`data:image/jpeg;base64,${base64Image}`);
            } catch (error) {
                console.error('Error fetching image data:', error);
            }
        };

        fetchImageData();
    }, [imageUrl]);

    return (
        <div>
            {imageData ? <img src={imageData} alt="Imagem do banco de dados" /> : 'Carregando imagem...'}
        </div>
    );
};

export default ImageRenderer;
