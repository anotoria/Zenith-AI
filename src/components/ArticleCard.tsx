
import React, { useState } from 'react';
import { Article, SocialCopy, GeneratedImage, AutoPostStatus } from '../types';
import { generateSocialCopy, generateArticleImage } from '../services/geminiService';
import { SparklesIcon } from './icons/Icon';

interface ArticleCardProps {
  article: Article;
  onUpdate: (updatedArticle: Article) => void;
  onSchedule: (article: Article) => void;
}

const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
);

export const ArticleCard: React.FC<ArticleCardProps> = ({ article, onUpdate, onSchedule }) => {
  const [error, setError] = useState<string | null>(null);

  const handleGenerateContent = async () => {
    onUpdate({ ...article, isGenerating: true });
    setError(null);
    try {
      const copies = await generateSocialCopy(article.title);

      const imagePromises = [
        generateArticleImage(article.title),
        generateArticleImage(article.title),
        generateArticleImage(article.title),
      ];
      const images = await Promise.all(imagePromises);
      
      onUpdate({
        ...article,
        isGenerating: false,
        copies,
        images,
        selectedCopyId: copies[0]?.id,
        selectedImageId: images[0]?.id,
      });

    } catch (err) {
      console.error(err);
      setError("Falha ao gerar conteúdo. Tente novamente.");
      onUpdate({ ...article, isGenerating: false });
    }
  };

  const handleSelectCopy = (id: string) => {
    onUpdate({ ...article, selectedCopyId: id });
  };

  const handleSelectImage = (id: string) => {
    onUpdate({ ...article, selectedImageId: id });
  };
  
  const selectedImage = article.images?.find(img => img.id === article.selectedImageId);

  return (
    <div className="bg-surface rounded-lg border border-border shadow-lg overflow-hidden transition-all duration-300 relative">
      {/* Auto-Post Status Badge */}
      {article.autoPostStatus === AutoPostStatus.SUCCESS && (
          <div className="absolute top-0 right-0 bg-green-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg shadow-sm z-10 flex items-center">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              Postado no {article.autoPostPlatform || 'Facebook'}
          </div>
      )}
      {article.autoPostStatus === AutoPostStatus.ERROR && (
          <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg shadow-sm z-10 flex items-center">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              Falha no Auto-Post
          </div>
      )}

      <div className="p-4 md:p-6">
        <p className="text-xs md:text-sm text-text-secondary mb-1">
          {new Date(article.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
        </p>
        <h3 className="text-base md:text-lg font-bold text-text-primary">{article.title}</h3>
        {article.autoPostedAt && (
            <p className="text-[10px] text-green-400 mt-1">
                Sincronizado automaticamente em: {article.autoPostedAt.toLocaleString()}
            </p>
        )}
      </div>

      {!article.copies && !article.images && (
        <div className="p-4 md:p-6 border-t border-border">
          {article.isGenerating ? (
            <div className="flex items-center justify-center text-primary">
                <LoadingSpinner />
                <span className="ml-2 text-sm md:text-base">Gerando conteúdo com IA...</span>
            </div>
          ) : (
            <button
              onClick={handleGenerateContent}
              className="w-full bg-primary text-white font-bold py-2.5 px-4 rounded-md hover:bg-primary-hover transition-colors flex items-center justify-center text-sm md:text-base"
            >
              <SparklesIcon className="w-5 h-5 mr-2" />
              Gerar Conteúdo para Post
            </button>
          )}
           {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
        </div>
      )}

      {article.copies && article.images && (
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-px bg-border border-t border-border">
          {/* Copies Section */}
          <div className="bg-surface p-4 md:p-6">
            <h4 className="font-semibold text-text-primary mb-3 text-sm md:text-base">Copys Geradas</h4>
            <div className="space-y-3">
              {article.copies.map(copy => (
                <div
                  key={copy.id}
                  onClick={() => handleSelectCopy(copy.id)}
                  className={`p-3 rounded-md cursor-pointer transition-all duration-200 border-2 ${
                    article.selectedCopyId === copy.id
                      ? 'border-primary bg-primary/10'
                      : 'border-transparent bg-background hover:bg-border'
                  }`}
                >
                  <p className="text-xs md:text-sm text-text-secondary">{copy.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Images Section */}
          <div className="bg-surface p-4 md:p-6">
            <h4 className="font-semibold text-text-primary mb-3 text-sm md:text-base">Imagens Geradas</h4>
            {selectedImage && (
                <div className="mb-4 rounded-lg overflow-hidden aspect-video border border-border">
                    <img src={selectedImage.url} alt={selectedImage.prompt} className="w-full h-full object-cover"/>
                </div>
            )}
            <div className="grid grid-cols-3 gap-2">
              {article.images.map(image => (
                <div
                  key={image.id}
                  onClick={() => handleSelectImage(image.id)}
                  className={`aspect-square rounded-md overflow-hidden cursor-pointer ring-2 transition-all duration-200 ${
                    article.selectedImageId === image.id
                      ? 'ring-primary'
                      : 'ring-transparent hover:ring-primary/50'
                  }`}
                >
                  <img src={image.url} alt={image.prompt} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {article.copies && article.images && (
         <div className="p-4 bg-surface border-t border-border flex justify-end">
            <button
                onClick={() => onSchedule(article)}
                disabled={article.isScheduled}
                className={`w-full md:w-auto font-bold py-2 px-6 rounded-md transition-colors text-sm md:text-base ${
                    article.isScheduled 
                    ? 'bg-gray-500 text-gray-300 cursor-not-allowed' 
                    : 'bg-secondary text-white hover:bg-green-600'
                }`}
            >
                {article.isScheduled ? 'Agendado' : 'Agendar Post'}
            </button>
         </div>
      )}
    </div>
  );
};
