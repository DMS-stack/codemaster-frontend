import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

export default function Pagamento() {
  const [info, setInfo] = useState(null);
  const [metodo, setMetodo] = useState('transferencia');

  useEffect(() => {
    api.get('/pagamento/info').then(r => setInfo(r.data));
  }, []);

  if (!info) return (
    <div className="min-h-screen bg-bg flex items-center justify-center text-accent font-mono text-sm">
      A carregar informações de pagamento...
    </div>
  );

  return (
    <div className="min-h-screen bg-bg text-white font-body px-[5%] py-16">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@700;900&family=DM+Sans:wght@400;500&display=swap');
      .font-display{font-family:'Syne',sans-serif} .font-mono{font-family:'Space Mono',monospace} .font-body{font-family:'DM Sans',sans-serif}`}</style>

      <Link to="/" className="font-display font-black text-2xl block mb-12">
        Code<span className="text-accent">Master</span>
      </Link>

      <div className="max-w-2xl">
        <p className="font-mono text-xs text-accent uppercase tracking-widest mb-2">// Pagamento</p>
        <h1 className="font-display font-black text-4xl mb-4 tracking-tight">Instruções de Pagamento</h1>
        <p className="text-gray-400 mb-10 leading-relaxed">
          Escolha o método, realize o pagamento e envie o comprovativo via WhatsApp.<br />
          A sua vaga será confirmada em até 24h.
        </p>

        {/* Método selector */}
        <div className="flex gap-3 mb-8">
          {['transferencia','multicaixa'].map(m => (
            <button key={m} onClick={() => setMetodo(m)}
              className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${metodo === m ? 'bg-accent text-black' : 'bg-card border border-gray-700 text-gray-300'}`}>
              {m === 'transferencia' ? '🏦 Transferência Bancária' : '📱 Multicaixa Express'}
            </button>
          ))}
        </div>

        {/* Dados */}
        <div className="bg-card border border-gray-800 rounded-2xl p-8 mb-8">
          {metodo === 'transferencia' ? (
            <div className="space-y-4">
              <h3 className="font-display font-bold text-lg mb-4">Dados Bancários</h3>
              {[
                { label: 'Banco',          value: info.transferencia.banco },
                { label: 'Titular',        value: info.transferencia.titular },
                { label: 'Nº de Conta',   value: info.transferencia.conta },
                { label: 'IBAN',           value: info.transferencia.iban },
              ].map(row => (
                <div key={row.label} className="flex justify-between items-center border-b border-gray-800 pb-3">
                  <span className="font-mono text-xs text-gray-500 uppercase tracking-wider">{row.label}</span>
                  <span className="font-mono text-sm text-white">{row.value}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="font-display font-bold text-lg mb-4">Multicaixa Express</h3>
              {[
                { label: 'Telefone', value: info.multicaixa.telefone },
                { label: 'Titular',  value: info.multicaixa.titular },
              ].map(row => (
                <div key={row.label} className="flex justify-between items-center border-b border-gray-800 pb-3">
                  <span className="font-mono text-xs text-gray-500 uppercase tracking-wider">{row.label}</span>
                  <span className="font-mono text-sm text-white">{row.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Preços referência */}
        <div className="bg-accent/5 border border-accent/20 rounded-2xl p-6 mb-8">
          <p className="font-mono text-xs text-accent uppercase tracking-wider mb-4">// Valores de referência</p>
          <div className="flex gap-6 flex-wrap">
            <div><p className="text-gray-400 text-xs">Módulo Individual</p><p className="font-display font-black text-2xl text-white">10.000 Kz</p></div>
            <div><p className="text-gray-400 text-xs">Curso Completo</p><p className="font-display font-black text-2xl text-accent">18.000 Kz</p><p className="font-mono text-xs text-accent">-2.000 Kz desconto</p></div>
          </div>
        </div>

        {/* WhatsApp CTA */}
        <a href={`https://wa.me/${info.whatsapp}?text=${encodeURIComponent('Olá! Realizei o pagamento do curso Dev Pro. Seguem os dados e comprovativo em anexo.')}`}
          target="_blank" rel="noreferrer"
          className="flex items-center justify-center gap-3 bg-green-500 hover:bg-green-400 text-black font-bold py-4 rounded-xl transition-colors text-base w-full">
          📲 Enviar comprovativo via WhatsApp
        </a>
        <p className="text-gray-600 text-xs text-center mt-3">
          Numero: +{info.whatsapp} · Confirmaremos em até 24h
        </p>
      </div>
    </div>
  );
}
