'use client';

import LegalContentLayout from '@/components/layout/LegalContentLayout';
import { en } from '@/lib/locales/en';

interface SubSection {
  subtitle: string;
  description: string;
  items?: string[];
}

interface OfficerDetails {
  name: string;
  designation: string;
  entity: string;
  address: string;
  email: string;
  timing: string;
}

interface PrivacySection {
  id: string;
  title: string;
  content?: string | string[];
  subSections?: SubSection[];
  items?: string[];
  officerDetails?: OfficerDetails;
  razorpayNote?: string;
}

const PrivacyPolicy = () => {
  const sectionsData = en.privacyPolicy.sections as PrivacySection[];

  return (
    <LegalContentLayout
      title={en.privacyPolicy.title}
      lastUpdated={en.privacyPolicy.effectiveDate}
      sections={sectionsData.map((s) => ({ id: s.id, title: s.title }))}
    >
      {sectionsData.map((section, index) => (
        <section
          key={section.id}
          id={section.id}
          className='mb-12 scroll-mt-24'
        >
          {/* Main Section Heading */}
          <h2 className='text-2xl font-bold mb-4 text-gray-900'>
            {index + 1}. {section.title}
          </h2>

          {/* Main Description */}
          {section.content && (
            <div className='space-y-4 mb-6'>
              {(Array.isArray(section.content)
                ? section.content
                : [section.content]
              ).map((p, i) => (
                <p
                  key={i}
                  className='text-lg text-muted-foreground leading-relaxed'
                >
                  {p}
                </p>
              ))}
            </div>
          )}

          {/* Sub Sections - Formatted with dark subheadings */}
          {section.subSections?.map((sub, idx) => (
            <div key={idx} className='mt-8 mb-6'>
              <h3 className='text-xl font-bold text-gray-900 mb-3'>
                {sub.subtitle}
              </h3>
              <p className='text-lg text-muted-foreground leading-relaxed mb-4'>
                {sub.description}
              </p>
              {sub.items && (
                <ul className='list-disc list-outside ml-6 text-lg text-muted-foreground leading-relaxed space-y-3 mb-6'>
                  {sub.items.map((item, i) => (
                    <li key={i} className='pl-2'>
                      <span className='marker:text-gray-900'>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          {/* Simple List Items (Direct under main section) */}
          {section.items && (
            <ul className='list-disc list-outside ml-6 text-lg text-muted-foreground leading-relaxed space-y-3 mb-6'>
              {section.items.map((item, i) => (
                <li key={i} className='pl-2'>
                  {item}
                </li>
              ))}
            </ul>
          )}

          {/* Grievance Officer Box - Styled exactly like the TOS contact box */}
          {section.officerDetails && (
            <div className='bg-gray-50 rounded-xl p-8 mt-8 border border-gray-100'>
              <h3 className='text-gray-900 font-bold text-lg mb-6'>
                Grievance Officer Details
              </h3>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12'>
                {[
                  { label: 'Name', value: section.officerDetails.name },
                  {
                    label: 'Designation',
                    value: section.officerDetails.designation,
                  },
                  { label: 'Entity', value: section.officerDetails.entity },
                  {
                    label: 'Email',
                    value: section.officerDetails.email,
                    isLink: true,
                  },
                  { label: 'Timing', value: section.officerDetails.timing },
                ].map((detail, idx) => (
                  <div
                    key={idx}
                    className='flex flex-col border-b border-gray-200/50 pb-2 last:border-0'
                  >
                    <span className='text-[11px] uppercase tracking-widest text-gray-400 font-bold mb-1'>
                      {detail.label}
                    </span>
                    <span className='text-gray-900 font-semibold text-[15px]'>
                      {detail.isLink ? (
                        <a
                          href={`mailto:${detail.value}`}
                          className='text-blue-600 hover:underline'
                        >
                          {detail.value}
                        </a>
                      ) : (
                        detail.value
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Razorpay Legal Note */}
          {section.razorpayNote && (
            <div className='mt-10 p-4 border-l-4 border-gray-200 bg-gray-50/50'>
              <p className='text-sm italic text-muted-foreground leading-relaxed'>
                {section.razorpayNote}
              </p>
            </div>
          )}
        </section>
      ))}
      <div className='mt-8 pt-6 border-t border-slate-200'>
        <h3 className='font-bold text-slate-800 mb-4 text-md'>
          Additional Information
        </h3>
        <ul className='space-y-3'>
          <li>
            <a
              href='https://merchant.razorpay.com/policy/S0VGGF8ckn9XMF/contact_us'
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-600 hover:text-blue-800 hover:underline transition-colors'
            >
              Contact Us
            </a>
          </li>
          <li>
            <a
              href='https://merchant.razorpay.com/policy/S0VGGF8ckn9XMF/shipping'
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-600 hover:text-blue-800 hover:underline transition-colors'
            >
              Shipping Policy
            </a>
          </li>
          <li>
            <a
              href='https://merchant.razorpay.com/policy/S0VGGF8ckn9XMF/refund'
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-600 hover:text-blue-800 hover:underline transition-colors'
            >
              Refund & Cancellation Policy
            </a>
          </li>
        </ul>
      </div>
    </LegalContentLayout>
  );
};

export default PrivacyPolicy;
