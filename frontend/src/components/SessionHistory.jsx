import React from 'react';
import { 
  History, 
  Trash2, 
  ExternalLink, 
  Clock, 
  Maximize2, 
  Download, 
  Check, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function SessionHistory({
  historyItems = [],
  activeItemId,
  onSelectHistoryItem,
  onClearHistory
}) {
  if (!historyItems || historyItems.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-brand-600" />
          <h3 className="font-bold text-slate-800 text-sm">
            Session Enhancement History
          </h3>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600">
            {historyItems.length}
          </span>
        </div>

        <button
          type="button"
          onClick={onClearHistory}
          className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2 py-1 rounded-lg transition-colors"
          title="Clear all session history records"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Session</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {historyItems.map((item) => {
          const isActive = activeItemId === item.id;
          return (
            <div
              key={item.id}
              className={`p-3 rounded-xl border transition-all duration-150 flex items-center justify-between gap-3 ${
                isActive
                  ? 'border-brand-500 bg-brand-50/50 shadow-xs ring-2 ring-brand-300'
                  : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 shadow-2xs'
              }`}
            >
              {/* Thumbnail */}
              <div 
                onClick={() => onSelectHistoryItem(item)}
                className="w-14 h-14 rounded-lg overflow-hidden bg-slate-900 border border-slate-200 shrink-0 cursor-pointer shadow-inner relative group"
              >
                <img
                  src={item.thumbnail_data_uri}
                  alt={item.filename}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <ExternalLink className="w-4 h-4 text-white" />
                </div>
              </div>

              {/* Details */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <span className="font-semibold text-slate-900 text-xs truncate max-w-[140px]" title={item.filename}>
                    {item.filename}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {item.timestamp}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-500">
                  <span className="font-medium text-brand-700 bg-brand-50 px-1.5 py-0.2 rounded border border-brand-200">
                    {item.preset || 'Custom'}
                  </span>
                  <span>&bull;</span>
                  <span>{item.dimensions_after}</span>
                </div>

                <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100 text-[10px] text-slate-500">
                  <span>Sharp: {item.sharpness_after}</span>
                  <button
                    type="button"
                    onClick={() => onSelectHistoryItem(item)}
                    className="text-brand-600 hover:text-brand-700 font-semibold flex items-center gap-0.5"
                  >
                    <span>Reopen</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
