import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import type { FAQ } from '../../data/course-sample'

interface FAQAccordionProps {
  faqs: FAQ[]
}

const FAQAccordion = ({ faqs }: FAQAccordionProps) => {
  const [expandedItems, setExpandedItems] = useState<number[]>([])

  const toggleItem = (id: number) => {
    setExpandedItems(prev => 
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
      <div className="space-y-3">
        {faqs.map((faq) => (
          <div key={faq.id} className="bg-white rounded-lg border border-gray-100 shadow-sm">
            <button
              onClick={() => toggleItem(faq.id)}
              className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
              aria-expanded={expandedItems.includes(faq.id)}
            >
              <h3 className="font-medium text-gray-900 pr-4">{faq.question}</h3>
              {expandedItems.includes(faq.id) ? (
                <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
              )}
            </button>

            {expandedItems.includes(faq.id) && (
              <div className="border-t border-gray-100 px-4 py-3">
                <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default FAQAccordion
