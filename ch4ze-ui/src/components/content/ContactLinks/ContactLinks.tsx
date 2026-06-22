import { useState, useEffect } from 'react';
import { CONTACT_LINKS, ContactLink } from '../../../sample-data/contact';
import styles from './ContactLinks.module.css';

export interface ContactLinksProps {
  links?: ContactLink[];
  className?: string;
}

export function ContactLinks({ links = CONTACT_LINKS, className }: ContactLinksProps): JSX.Element {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    if (copiedKey === null) return;
    const timer = setTimeout(() => setCopiedKey(null), 1500);
    return () => clearTimeout(timer);
  }, [copiedKey]);

  const handleCopyClick = async (link: ContactLink) => {
    if (!link.copy) return;
    try {
      await navigator.clipboard?.writeText(link.copy);
      setCopiedKey(link.key);
    } catch (e) {
      // Clipboard access failed silently
    }
  };

  const classNames = [styles.contactLinks, className].filter(Boolean).join(' ');

  return (
    <div className={classNames}>
      {links.map((link) => {
        if (link.copy) {
          const isCopied = copiedKey === link.key;
          const buttonClasses = [styles.clink, isCopied ? styles.copied : '']
            .filter(Boolean)
            .join(' ');
          return (
            <button
              key={link.key}
              className={buttonClasses}
              onClick={() => handleCopyClick(link)}
              title="Click to copy"
            >
              <span className={styles.k}>{link.key}</span>
              <span className={styles.v}>{link.value}</span>
            </button>
          );
        }

        const aClasses = [styles.clink].filter(Boolean).join(' ');
        return (
          <a
            key={link.key}
            className={aClasses}
            href={link.href}
            target={link.target}
            rel={link.target === '_blank' ? 'noopener' : undefined}
          >
            <span className={styles.k}>{link.key}</span>
            <span className={styles.v}>{link.value}</span>
          </a>
        );
      })}
    </div>
  );
}
