import LegalContentLayout from '@/components/layout/LegalContentLayout';
import { en } from '@/lib/locales/en';

const sections = [
  { id: 'acceptance', title: 'Acceptance of Terms' },
  { id: 'user-obligations', title: 'User Obligations' },
  { id: 'bookings', title: 'Booking & Cancellations' },
  { id: 'payments', title: 'Payments & Fees' },
  { id: 'liability', title: 'Limitation of Liability' },
  { id: 'intellectual-property', title: 'Intellectual Property' },
  { id: 'termination', title: 'Termination' },
  { id: 'governing-law', title: 'Governing Law' },
];

const TermsOfService = () => {
  return (
    <LegalContentLayout
      title={en.termsOfService.title}
      lastUpdated={en.termsOfService.lastUpdated}
      sections={sections}
    >
      {/* Acceptance of Terms */}
      <section id='acceptance' className='mb-12 scroll-mt-24'>
        <h2 className='text-2xl font-bold mb-4'>1. Acceptance of Terms</h2>
        <p className='text-lg text-muted-foreground leading-relaxed mb-4'>
          By accessing or using Rent-O-Infra (&quot;the Platform&quot;), you
          agree to be bound by these Terms of Service. If you do not agree to
          these terms, you may not access or use the Platform.
        </p>
        <p className='text-lg text-muted-foreground leading-relaxed'>
          These terms apply to all users of the Platform, including researchers,
          lab administrators, institutional partners, and visitors. We reserve
          the right to modify these terms at any time, with changes becoming
          effective upon posting to the Platform.
        </p>
      </section>

      {/* User Obligations */}
      <section id='user-obligations' className='mb-12 scroll-mt-24'>
        <h2 className='text-2xl font-bold mb-4'>2. User Obligations</h2>
        <p className='text-lg text-muted-foreground leading-relaxed mb-4'>
          As a user of Rent-O-Infra, you agree to:
        </p>
        <ul className='list-disc list-inside text-lg text-muted-foreground leading-relaxed space-y-2 mb-4'>
          <li>
            <strong className='text-gray-900'>Safety Compliance:</strong> Adhere
            to all Lab Safety protocols, including BSL-2 and BSL-3 requirements
            where applicable.
          </li>
          <li>
            <strong className='text-gray-900'>Certifications:</strong> Possess
            and maintain valid certifications required for equipment operation.
          </li>
          <li>
            <strong className='text-gray-900'>Accurate Information:</strong>{' '}
            Provide truthful and accurate information in your profile and
            booking requests.
          </li>
          <li>
            <strong className='text-gray-900'>Respectful Conduct:</strong> Treat
            lab staff and equipment with care and professionalism.
          </li>
          <li>
            <strong className='text-gray-900'>Confidentiality:</strong> Respect
            the confidentiality of other users&apos; research and proprietary
            information.
          </li>
        </ul>
        <p className='text-lg text-muted-foreground leading-relaxed'>
          Failure to comply with these obligations may result in suspension or
          termination of your account.
        </p>
      </section>

      {/* Bookings */}
      <section id='bookings' className='mb-12 scroll-mt-24'>
        <h2 className='text-2xl font-bold mb-4'>3. Booking & Cancellations</h2>
        <p className='text-lg text-foreground leading-relaxed mb-4'>
          All bookings made through the Platform are subject to the following
          terms:
        </p>
        <ul className='list-disc list-inside text-lg text-muted-foreground leading-relaxed space-y-2 mb-4'>
          <li>
            <strong className='text-gray-900'>Binding Agreement:</strong> Once a
            booking is confirmed, it constitutes a binding agreement between the
            researcher and the lab.
          </li>
          <li>
            <strong className='text-gray-900'>Cancellation Policy:</strong>{' '}
            Cancellations made within 24 hours of the scheduled slot are subject
            to a cancellation fee of up to 50% of the booking value.
          </li>
          <li>
            <strong className='text-gray-900'>No-Shows:</strong> Failure to
            appear for a confirmed booking without prior notice will result in
            full charge and may affect future booking privileges.
          </li>
          <li>
            <strong className='text-gray-900'>Lab Cancellations:</strong> Labs
            must provide at least 48 hours notice for cancellations. Researchers
            will receive full refunds for lab-initiated cancellations.
          </li>
        </ul>
      </section>

      {/* Payments */}
      <section id='payments' className='mb-12 scroll-mt-24'>
        <h2 className='text-2xl font-bold mb-4'>4. Payments & Fees</h2>
        <p className='text-lg text-muted-foreground leading-relaxed mb-4'>
          Payment terms for Platform transactions:
        </p>
        <ul className='list-disc list-inside text-lg text-muted-foreground leading-relaxed space-y-2'>
          <li>
            <strong className='text-gray-900'>Payment Processing:</strong> All
            payments are processed securely through Razorpay.
          </li>
          <li>
            <strong className='text-gray-900'>Platform Fee:</strong>{' '}
            Rent-O-Infra charges a platform fee of 10-15% on each transaction,
            deducted from lab payouts.
          </li>
          <li>
            <strong className='text-gray-900'>GST & Taxes:</strong> All listed
            prices are exclusive of applicable GST. Invoices will include
            appropriate tax breakdowns.
          </li>
          <li>
            <strong className='text-gray-900'>Payout Schedule:</strong> Labs
            receive payouts within 7 business days of service completion.
          </li>
        </ul>
      </section>

      {/* Liability */}
      <section id='liability' className='mb-12 scroll-mt-24'>
        <h2 className='text-2xl font-bold mb-4'>5. Limitation of Liability</h2>
        <p className='text-lg text-muted-foreground leading-relaxed mb-4'>
          Rent-O-Infra operates as a marketplace facilitator connecting
          researchers with laboratory facilities. As such:
        </p>
        <ul className='list-disc list-inside text-lg text-muted-foreground leading-relaxed space-y-2'>
          <li>
            We are not liable for experimental results, data quality, or
            scientific outcomes.
          </li>
          <li>
            We do not guarantee equipment availability, functionality, or
            fitness for specific purposes.
          </li>
          <li>
            Labs are solely responsible for equipment maintenance, calibration,
            and safety compliance.
          </li>
          <li>
            Our total liability for any claim shall not exceed the fees paid to
            Rent-O-Infra in the 12 months preceding the claim.
          </li>
        </ul>
      </section>

      {/* Intellectual Property */}
      <section id='intellectual-property' className='mb-12 scroll-mt-24'>
        <h2 className='text-2xl font-bold mb-4'>6. Intellectual Property</h2>
        <p className='text-lg text-muted-foreground leading-relaxed mb-4'>
          Ownership of research data and intellectual property:
        </p>
        <ul className='list-disc list-inside text-lg text-muted-foreground leading-relaxed space-y-2 mb-4'>
          <li>
            <strong className='text-gray-900'>Researcher Ownership:</strong> All
            data generated on the Platform, including experimental results,
            analyses, and discoveries, belongs solely to the Researcher and
            their affiliated institution.
          </li>
          <li>
            <strong className='text-gray-900'>No Lab Claims:</strong> Labs
            providing equipment or services claim no ownership rights over IP
            generated using their facilities.
          </li>
          <li>
            <strong className='text-gray-900'>Platform Content:</strong> The
            Rent-O-Infra name, logo, and platform design are our exclusive
            property.
          </li>
          <li>
            <strong className='text-gray-900'>User Content:</strong> You retain
            ownership of content you upload but grant us a license to display it
            as necessary for platform operations.
          </li>
        </ul>
      </section>

      {/* Termination */}
      <section id='termination' className='mb-12 scroll-mt-24'>
        <h2 className='text-2xl font-bold mb-4'>7. Termination</h2>
        <p className='text-lg text-muted-foreground leading-relaxed mb-4'>
          Either party may terminate the relationship under the following
          conditions:
        </p>
        <ul className='list-disc list-inside text-lg text-muted-foreground leading-relaxed space-y-2'>
          <li>
            <strong className='text-gray-900'>User Termination:</strong> You may
            delete your account at any time through your profile settings.
          </li>
          <li>
            <strong className='text-gray-900'>Platform Termination:</strong> We
            may suspend or terminate accounts for violation of these terms,
            fraudulent activity, or at our discretion with 30 days notice.
          </li>
          <li>
            <strong className='text-gray-900'>Effect of Termination:</strong>{' '}
            Upon termination, pending bookings will be honored or refunded, and
            you may request export of your data.
          </li>
        </ul>
      </section>

      {/* Governing Law */}
      <section id='governing-law' className='scroll-mt-24'>
        <h2 className='text-2xl font-bold mb-4'>8. Governing Law</h2>
        <p className='text-lg text-muted-foreground leading-relaxed mb-4'>
          These Terms of Service shall be governed by and construed in
          accordance with the laws of India. Any disputes arising from these
          terms or your use of the Platform shall be subject to the exclusive
          jurisdiction of the courts in Bangalore, Karnataka.
        </p>
        <div className='bg-gray-50 rounded-xl p-6'>
          <p className='text-gray-900 font-medium mb-2'>
            Questions about these terms?
          </p>
          <p className='text-muted-foreground'>
            Contact us at{' '}
            <a
              href='mailto:legal@rentoinfra.com'
              className='text-blue-600 hover:underline'
            >
              legal@rentoinfra.com
            </a>
          </p>
        </div>
      </section>
    </LegalContentLayout>
  );
};

export default TermsOfService;
