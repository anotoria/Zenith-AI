import React, { useState } from 'react';
import { IMAGE_TYPES, VIDEO_TYPES, COPY_TYPES, COPY_METHODS } from '../constants';
import { generateCustomImage, generateCustomVideo, generateCustomCopy } from '../services/geminiService';
import { SavedItemType } from '../types';

type Tab = 'image' | 'video' | 'copy';

interface AICreatorProps {
    onSaveItem?: (type: SavedItemType, content: string, prompt: string, description: string) => void;
}

const InputLabel: React.FC<{ label: string, required?: boolean }> = ({ label, required }) => (
    <label className="block text-sm font-medium text-text-secondary mb-1">
        {label} {required && <span className="text-red-500">*</span>}
    </label>
);

export const AICreator: React.FC<AICreatorProps> = ({ onSaveItem }) => {
    const [activeTab, setActiveTab] = useState<Tab>('image');
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [needsApiKey, setNeedsApiKey] = useState(false);

    // --- Image State ---
    const [imgIdea, setImgIdea] = useState('');
    const [imgDesc, setImgDesc] = useState('');
    const [imgType, setImgType] = useState(IMAGE_TYPES[0]);
    const [imgDetails, setImgDetails] = useState('');
    const [generatedImg, setGeneratedImg] = useState<{url: string, prompt: string} | null>(null);
    const [isZoomOpen, setIsZoomOpen] = useState(false);

    // --- Video State ---
    const [vidIdea, setVidIdea] = useState('');
    const [vidDesc, setVidDesc] = useState('');
    const [vidType, setVidType] = useState(VIDEO_TYPES[0]);
    const [vidDetails, setVidDetails] = useState('');
    const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
    const [isVideoPreviewOpen, setIsVideoPreviewOpen] = useState(false);

    // --- Copy State ---
    const [copyIdea, setCopyIdea] = useState('');
    const [copyDesc, setCopyDesc] = useState('');
    const [copyType, setCopyType] = useState(COPY_TYPES[0]);
    const [copyMethod, setCopyMethod] = useState(COPY_METHODS[0]);
    const [copyCount, setCopyCount] = useState(1);
    const [copyTitle, setCopyTitle] = useState('');
    const [generatedCopies, setGeneratedCopies] = useState<string[]>([]);
    const [editingCopyIndex, setEditingCopyIndex] = useState<number | null>(null);

    // --- Handlers ---

    const handleGenerateImage = async () => {
        if (!imgIdea || !imgDesc || !imgType) return setError("Preencha os campos obrigatórios.");
        setError(null);
        setNeedsApiKey(false);
        setIsGenerating(true);
        try {
            const result = await generateCustomImage(imgIdea, imgDesc, imgType, imgDetails);
            setGeneratedImg({ url: result.url, prompt: result.prompt });
        } catch (e) {
            setError("Erro ao gerar imagem.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleGenerateVideo = async () => {
        if (!vidIdea || !vidDesc || !vidType) return setError("Preencha os campos obrigatórios.");
        setError(null);
        setNeedsApiKey(false);
        setIsGenerating(true);
        try {
            const url = await generateCustomVideo(vidIdea, vidDesc, vidType, vidDetails);
            setGeneratedVideoUrl(url);
        } catch (e: any) {
            if (e.message && (e.message.includes("Requested entity was not found") || e.message.includes("404"))) {
                setError("Para gerar vídeos, é necessário selecionar uma chave de API de um projeto com faturamento ativado.");
                setNeedsApiKey(true);
            } else {
                setError(e.message || "Erro ao gerar vídeo.");
            }
        } finally {
            setIsGenerating(false);
        }
    };

    const handleGenerateCopy = async () => {
        if (!copyIdea || !copyDesc || !copyType || !copyMethod) return setError("Preencha os campos obrigatórios.");
        setError(null);
        setNeedsApiKey(false);
        setIsGenerating(true);
        setEditingCopyIndex(null); // Reset editing state on new generation
        try {
            const results = await generateCustomCopy(copyIdea, copyDesc, copyType, copyMethod, copyCount, copyTitle);
            setGeneratedCopies(results);
        } catch (e) {
            setError("Erro ao gerar copy.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSelectKey = async () => {
        const win = window as any;
        if (win.aistudio) {
            await win.aistudio.openSelectKey();
            setNeedsApiKey(false);
            setError(null);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert("Copiado!");
    };

    const handleSave = (type: SavedItemType, content: string, prompt: string, description: string) => {
        if (onSaveItem) {
            onSaveItem(type, content, prompt, description);
            alert("Item salvo na sua biblioteca!");
        }
    };

    return (
        <div className="animate-fade-in max-w-6xl mx-auto pb-10">
            <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-text-primary">Criando com IA</h2>
                <p className="text-text-secondary mt-1 text-sm md:text-base">Transforme suas ideias em Imagens, Vídeos e Textos persuasivos.</p>
            </div>

            {/* Tabs - Scrollable on mobile */}
            <div className="flex space-x-4 mb-6 border-b border-border overflow-x-auto custom-scrollbar">
                <button 
                    onClick={() => setActiveTab('image')}
                    className={`pb-3 px-4 font-medium transition-colors border-b-2 whitespace-nowrap ${activeTab === 'image' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary'}`}
                >
                    Gerador de Imagens
                </button>
                <button 
                    onClick={() => setActiveTab('video')}
                    className={`pb-3 px-4 font-medium transition-colors border-b-2 whitespace-nowrap ${activeTab === 'video' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary'}`}
                >
                    Gerador de Vídeos
                </button>
                <button 
                    onClick={() => setActiveTab('copy')}
                    className={`pb-3 px-4 font-medium transition-colors border-b-2 whitespace-nowrap ${activeTab === 'copy' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary'}`}
                >
                    Gerador de Copywriting
                </button>
            </div>

            {needsApiKey && (
                <div className="mb-6 p-4 bg-yellow-900/20 border border-yellow-500/50 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center text-yellow-200">
                         <svg className="w-6 h-6 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                         <div>
                             <p className="font-bold text-sm">Ação Necessária: Configuração de Faturamento</p>
                             <p className="text-xs mt-1">O modelo Veo requer uma chave de API de um projeto Google Cloud com faturamento ativado.</p>
                              <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="text-xs underline mt-1 block hover:text-white">Saiba mais sobre faturamento</a>
                         </div>
                    </div>
                    <button 
                        onClick={handleSelectKey} 
                        className="bg-yellow-600 hover:bg-yellow-500 text-white px-6 py-2 rounded-lg text-sm font-bold transition-colors shadow-lg shadow-yellow-900/20 whitespace-nowrap w-full sm:w-auto"
                    >
                        Selecionar Chave de API
                    </button>
                </div>
            )}

            {error && !needsApiKey && <div className="bg-red-900/20 border border-red-500/50 text-red-200 p-4 rounded-lg mb-6">{error}</div>}

            {/* IMAGE GENERATOR */}
            {activeTab === 'image' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                    <div className="space-y-4 bg-surface p-4 md:p-6 rounded-lg border border-border h-fit order-2 lg:order-1">
                        <div>
                            <InputLabel label="Ideia Principal" required />
                            <input 
                                type="text" 
                                value={imgIdea} 
                                onChange={e => setImgIdea(e.target.value)}
                                className="w-full bg-background border border-border text-text-primary rounded-lg p-2.5 focus:ring-2 focus:ring-primary outline-none"
                                placeholder="Ex: Um astronauta andando de skate"
                            />
                        </div>
                        <div>
                            <InputLabel label="Descrição Detalhada" required />
                            <textarea 
                                value={imgDesc} 
                                onChange={e => setImgDesc(e.target.value)}
                                className="w-full bg-background border border-border text-text-primary rounded-lg p-2.5 h-24 resize-none focus:ring-2 focus:ring-primary outline-none"
                                placeholder="Detalhe a cena, o ambiente, as emoções..."
                            />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <InputLabel label="Estilo da Imagem" required />
                                <select 
                                    value={imgType} 
                                    onChange={e => setImgType(e.target.value)}
                                    className="w-full bg-background border border-border text-text-primary rounded-lg p-2.5 focus:ring-2 focus:ring-primary outline-none"
                                >
                                    {IMAGE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>
                            <div>
                                <InputLabel label="Anexar Foto (Base)" />
                                <input type="file" className="w-full text-sm text-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                            </div>
                        </div>
                        <div>
                            <InputLabel label="Detalhes de Cores e Luzes" />
                            <input 
                                type="text" 
                                value={imgDetails} 
                                onChange={e => setImgDetails(e.target.value)}
                                className="w-full bg-background border border-border text-text-primary rounded-lg p-2.5 focus:ring-2 focus:ring-primary outline-none"
                                placeholder="Ex: Neon, pôr do sol, iluminação dramática"
                            />
                        </div>
                        <button 
                            onClick={handleGenerateImage}
                            disabled={isGenerating}
                            className={`w-full py-3 rounded-lg font-bold text-white shadow-lg transition-all ${isGenerating ? 'bg-primary/50 cursor-not-allowed' : 'bg-primary hover:bg-primary-hover shadow-primary/20'}`}
                        >
                            {isGenerating ? 'Gerando...' : 'Gerar Imagem'}
                        </button>
                    </div>

                    <div className="bg-surface p-4 md:p-6 rounded-lg border border-border flex flex-col items-center justify-center min-h-[300px] md:min-h-[400px] order-1 lg:order-2">
                        {generatedImg ? (
                            <div className="w-full space-y-4">
                                <div className="relative group overflow-hidden rounded-lg border border-border">
                                    <img 
                                        src={generatedImg.url} 
                                        alt={generatedImg.prompt} 
                                        className="w-full h-auto object-cover cursor-pointer"
                                        onClick={() => setIsZoomOpen(true)}
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <p className="text-white font-medium text-sm">Clique para ampliar</p>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <button onClick={() => copyToClipboard(generatedImg.prompt)} className="flex-1 bg-background hover:bg-border text-text-primary py-2 rounded-lg border border-border transition-colors text-sm font-medium">
                                        Copiar Prompt
                                    </button>
                                    <a href={generatedImg.url} download="imagem-gerada.png" className="flex-1 bg-secondary hover:bg-green-600 text-white py-2 rounded-lg transition-colors text-center text-sm font-medium">
                                        Download
                                    </a>
                                </div>
                                <button 
                                    onClick={() => handleSave(SavedItemType.IMAGE, generatedImg.url, generatedImg.prompt, `${imgIdea} - ${imgType}`)}
                                    className="w-full bg-primary hover:bg-primary-hover text-white py-2 rounded-lg transition-colors text-center text-sm font-medium shadow-lg shadow-primary/20"
                                >
                                    Salvar na Biblioteca
                                </button>
                            </div>
                        ) : (
                            <div className="text-center text-text-secondary">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-background border border-border flex items-center justify-center">
                                    <svg className="w-8 h-8 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                </div>
                                <p>A imagem gerada aparecerá aqui.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

             {/* Zoom Modal */}
             {isZoomOpen && generatedImg && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4" onClick={() => setIsZoomOpen(false)}>
                    <img src={generatedImg.url} alt="Zoom" className="max-w-full max-h-full rounded-lg shadow-2xl" />
                </div>
            )}

            {/* VIDEO GENERATOR */}
            {activeTab === 'video' && (
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                    <div className="space-y-4 bg-surface p-4 md:p-6 rounded-lg border border-border h-fit order-2 lg:order-1">
                         <div>
                            <InputLabel label="Ideia Principal" required />
                            <input 
                                type="text" 
                                value={vidIdea} 
                                onChange={e => setVidIdea(e.target.value)}
                                className="w-full bg-background border border-border text-text-primary rounded-lg p-2.5 focus:ring-2 focus:ring-primary outline-none"
                                placeholder="Ex: Drone sobrevoando uma cidade futurista"
                            />
                        </div>
                        <div>
                            <InputLabel label="Descrição Detalhada" required />
                            <textarea 
                                value={vidDesc} 
                                onChange={e => setVidDesc(e.target.value)}
                                className="w-full bg-background border border-border text-text-primary rounded-lg p-2.5 h-24 resize-none focus:ring-2 focus:ring-primary outline-none"
                                placeholder="Descreva o movimento, a ação e o clima..."
                            />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <InputLabel label="Estilo de Vídeo" required />
                                <select 
                                    value={vidType} 
                                    onChange={e => setVidType(e.target.value)}
                                    className="w-full bg-background border border-border text-text-primary rounded-lg p-2.5 focus:ring-2 focus:ring-primary outline-none"
                                >
                                    {VIDEO_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>
                             <div>
                                <InputLabel label="Anexar Foto (Base)" />
                                <input type="file" className="w-full text-sm text-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                            </div>
                        </div>
                         <div>
                            <InputLabel label="Detalhes de Cores e Luzes" />
                            <input 
                                type="text" 
                                value={vidDetails} 
                                onChange={e => setVidDetails(e.target.value)}
                                className="w-full bg-background border border-border text-text-primary rounded-lg p-2.5 focus:ring-2 focus:ring-primary outline-none"
                            />
                        </div>
                        <button 
                            onClick={handleGenerateVideo}
                            disabled={isGenerating}
                            className={`w-full py-3 rounded-lg font-bold text-white shadow-lg transition-all ${isGenerating ? 'bg-primary/50 cursor-not-allowed' : 'bg-primary hover:bg-primary-hover shadow-primary/20'}`}
                        >
                            {isGenerating ? 'Gerando Vídeo...' : 'Gerar Vídeo'}
                        </button>
                    </div>

                    <div className="bg-surface p-4 md:p-6 rounded-lg border border-border flex flex-col items-center justify-center min-h-[300px] md:min-h-[400px] order-1 lg:order-2">
                         {generatedVideoUrl ? (
                            <div className="w-full space-y-4">
                                <video src={generatedVideoUrl} controls className="w-full rounded-lg border border-border" />
                                <div className="flex flex-col sm:flex-row gap-3">
                                     <button 
                                        onClick={() => setIsVideoPreviewOpen(true)} 
                                        className="flex-1 bg-background hover:bg-border text-text-primary py-2 rounded-lg border border-border transition-colors text-sm font-medium"
                                    >
                                        Visualização Rápida
                                    </button>
                                    <button onClick={() => copyToClipboard(`Video prompt: ${vidIdea} - ${vidDesc}`)} className="flex-1 bg-background hover:bg-border text-text-primary py-2 rounded-lg border border-border transition-colors text-sm font-medium">
                                        Copiar Prompt
                                    </button>
                                    <a href={generatedVideoUrl} download="video-gerado.mp4" className="flex-1 bg-secondary hover:bg-green-600 text-white py-2 rounded-lg transition-colors text-center text-sm font-medium">
                                        Download
                                    </a>
                                </div>
                                <button 
                                    onClick={() => handleSave(SavedItemType.VIDEO, generatedVideoUrl, `${vidIdea} - ${vidDesc}`, `${vidType} video`)}
                                    className="w-full bg-primary hover:bg-primary-hover text-white py-2 rounded-lg transition-colors text-center text-sm font-medium shadow-lg shadow-primary/20"
                                >
                                    Salvar na Biblioteca
                                </button>
                            </div>
                         ) : (
                             <div className="text-center text-text-secondary">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-background border border-border flex items-center justify-center">
                                    <svg className="w-8 h-8 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                                </div>
                                <p>O vídeo gerado aparecerá aqui.</p>
                            </div>
                         )}
                    </div>
                 </div>
            )}

             {/* Video Quick View Modal */}
             {isVideoPreviewOpen && generatedVideoUrl && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4" onClick={() => setIsVideoPreviewOpen(false)}>
                     <div className="relative w-full max-w-4xl" onClick={e => e.stopPropagation()}>
                        <button
                            onClick={() => setIsVideoPreviewOpen(false)}
                            className="absolute -top-8 right-0 text-white hover:text-gray-300 font-medium text-sm"
                        >
                            Fechar
                        </button>
                        <video src={generatedVideoUrl} controls autoPlay className="w-full rounded-lg shadow-2xl border border-border" />
                     </div>
                </div>
            )}

            {/* COPY GENERATOR */}
            {activeTab === 'copy' && (
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                    <div className="space-y-4 bg-surface p-4 md:p-6 rounded-lg border border-border h-fit order-2 lg:order-1">
                         <div>
                            <InputLabel label="Ideia Principal" required />
                            <input 
                                type="text" 
                                value={copyIdea} 
                                onChange={e => setCopyIdea(e.target.value)}
                                className="w-full bg-background border border-border text-text-primary rounded-lg p-2.5 focus:ring-2 focus:ring-primary outline-none"
                                placeholder="Ex: Lançamento de um curso de culinária"
                            />
                        </div>
                         <div>
                            <InputLabel label="Descrição Detalhada" required />
                            <textarea 
                                value={copyDesc} 
                                onChange={e => setCopyDesc(e.target.value)}
                                className="w-full bg-background border border-border text-text-primary rounded-lg p-2.5 h-24 resize-none focus:ring-2 focus:ring-primary outline-none"
                            />
                            <div className="text-right text-xs text-text-secondary mt-1">
                                <span className={copyDesc.length > 500 ? 'text-yellow-500' : ''}>{copyDesc.length}</span> caracteres
                            </div>
                        </div>
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                             <div>
                                <InputLabel label="Tipo de Copy" required />
                                <select 
                                    value={copyType} 
                                    onChange={e => setCopyType(e.target.value)}
                                    className="w-full bg-background border border-border text-text-primary rounded-lg p-2.5 focus:ring-2 focus:ring-primary outline-none"
                                >
                                    {COPY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>
                             <div>
                                <InputLabel label="Método de Copywriting" required />
                                <select 
                                    value={copyMethod} 
                                    onChange={e => setCopyMethod(e.target.value)}
                                    className="w-full bg-background border border-border text-text-primary rounded-lg p-2.5 focus:ring-2 focus:ring-primary outline-none"
                                >
                                    {COPY_METHODS.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>
                         </div>
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                             <div>
                                <InputLabel label="Título (Opcional)" />
                                <input 
                                    type="text" 
                                    value={copyTitle} 
                                    onChange={e => setCopyTitle(e.target.value)}
                                    className="w-full bg-background border border-border text-text-primary rounded-lg p-2.5 focus:ring-2 focus:ring-primary outline-none"
                                />
                            </div>
                            <div>
                                <InputLabel label={`Variações: ${copyCount}`} />
                                <input 
                                    type="range" 
                                    min="1" max="10" 
                                    value={copyCount} 
                                    onChange={e => setCopyCount(Number(e.target.value))}
                                    className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-primary mt-3"
                                />
                            </div>
                         </div>
                         <div>
                            <InputLabel label="Anexar Foto (Base)" />
                            <input type="file" className="w-full text-sm text-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                        </div>

                        <button 
                            onClick={handleGenerateCopy}
                            disabled={isGenerating}
                            className={`w-full py-3 rounded-lg font-bold text-white shadow-lg transition-all ${isGenerating ? 'bg-primary/50 cursor-not-allowed' : 'bg-primary hover:bg-primary-hover shadow-primary/20'}`}
                        >
                            {isGenerating ? 'Gerando Textos...' : 'Gerar Copy'}
                        </button>
                    </div>

                     <div className="bg-surface p-4 md:p-6 rounded-lg border border-border min-h-[300px] md:min-h-[400px] flex flex-col order-1 lg:order-2">
                        <h3 className="text-lg font-bold text-text-primary mb-4">Resultados</h3>
                        {generatedCopies.length > 0 ? (
                            <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar max-h-[500px] md:max-h-[600px]">
                                {generatedCopies.map((copy, idx) => (
                                    <div key={idx} className="bg-background border border-border rounded-lg p-4 hover:border-primary/50 transition-colors">
                                        <div className="flex flex-wrap justify-between items-center mb-2 gap-2">
                                            <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">Variação {idx + 1}</span>
                                            <div className="flex gap-2">
                                                <button 
                                                    onClick={() => handleSave(SavedItemType.COPY, copy, `${copyIdea} - ${copyType}`, `Método: ${copyMethod}`)} 
                                                    className="text-xs text-text-secondary hover:text-primary flex items-center"
                                                    title="Salvar na Biblioteca"
                                                >
                                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg>
                                                    Salvar
                                                </button>
                                                 <button 
                                                    onClick={() => setEditingCopyIndex(idx === editingCopyIndex ? null : idx)} 
                                                    className={`text-xs flex items-center ${editingCopyIndex === idx ? 'text-green-400 font-bold bg-green-400/10 px-2 py-0.5 rounded' : 'text-text-secondary hover:text-text-primary'}`}
                                                >
                                                    {editingCopyIndex === idx ? (
                                                        <>
                                                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                                            Concluir
                                                        </>
                                                    ) : (
                                                        'Editar'
                                                    )}
                                                </button>
                                                <button onClick={() => copyToClipboard(copy)} className="text-xs text-text-secondary hover:text-text-primary flex items-center">
                                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
                                                    Copiar
                                                </button>
                                            </div>
                                        </div>
                                        {editingCopyIndex === idx ? (
                                            <>
                                            <textarea 
                                                value={copy} 
                                                onChange={(e) => {
                                                    const newCopies = [...generatedCopies];
                                                    newCopies[idx] = e.target.value;
                                                    setGeneratedCopies(newCopies);
                                                }}
                                                className="w-full bg-surface border border-primary rounded p-3 text-sm h-48 focus:ring-2 focus:ring-primary outline-none resize-none"
                                                autoFocus
                                            />
                                            <div className="flex justify-between items-center mt-1">
                                                <span className="text-xs text-primary animate-pulse">Editando...</span>
                                                <div className="text-right text-xs text-text-secondary">{copy.length} caracteres</div>
                                            </div>
                                            </>
                                        ) : (
                                            <>
                                            <p className="text-sm text-text-secondary whitespace-pre-wrap leading-relaxed">{copy}</p>
                                            <div className="text-right text-xs text-text-secondary mt-2 pt-2 border-t border-border/30 flex justify-end items-center gap-2">
                                                <span>{copy.length} caracteres</span>
                                            </div>
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                             <div className="flex-1 flex flex-col items-center justify-center text-text-secondary">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-background border border-border flex items-center justify-center">
                                    <svg className="w-8 h-8 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                </div>
                                <p>Os textos gerados aparecerão aqui.</p>
                            </div>
                        )}
                     </div>
                 </div>
            )}
        </div>
    );
};