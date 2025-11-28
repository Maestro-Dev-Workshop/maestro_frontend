import { Component, OnInit } from '@angular/core';
import { MarkdownPipe } from '../../../shared/pipes/markdown-pipe';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-terms-of-service',
  imports: [MarkdownPipe],
  templateUrl: './terms-of-service.html',
  styleUrl: './terms-of-service.css',
})
export class TermsOfService implements OnInit {
  webURL = environment.production ? (environment.beta ? 'https://maestro-beta.netlify.app' : 'https://www.maestrolearningplatform.com') : 'http://localhost:4200';

  tosMarkdown: string = `

# **WEBSITE TERMS OF SERVICE – OVERMIND TECHNOLOGIES NIGERIA LIMITED**

## **PLEASE READ THESE TERMS OF SERVICE CAREFULLY BEFORE USING THIS SITE**

---

## **What’s in these terms?**

These terms tell you the rules for using our website **[www.maestrolearningplatform.com](${this.webURL})** (“our site”).

---

## **Who we are and how to contact us**

**[www.maestrolearningplatform.com](${this.webURL})** is operated by **Overmind Technologies Nigeria Limited** (“we”, “us”, “our”).
We are a private limited liability company registered in Nigeria with **RC 9005716**.

**Regulator:** Corporate Affairs Commission

**Contact:**
📧 [support@maestrolearningplatform.com](mailto:support@maestrolearningplatform.com)
📞 +234 703 135 6257

---

## **By using our site you accept these terms**

By accessing or using our site, you confirm that you accept these terms of service and agree to comply with them.
If you do **not** agree, you must not use our site.

We recommend printing or saving a copy of these terms for future reference.

---

## **Other terms that may apply to you**

The following additional terms also apply to your use of our site:

* [Our Privacy Policy](${this.webURL}/privacy-policy), which explains how we collect, use, and store your personal data.

---

## **We may make changes to these terms**

We may revise these terms from time to time. Each time you use our site, please check the terms in force at that time.

---

## **We may make changes to our site**

We may update or change our site periodically to reflect:

* changes to our products or services
* user needs
* business or regulatory requirements

---

## **We may suspend or withdraw our site**

We do not guarantee that our site or its content will always be available or uninterrupted.

We may suspend, withdraw, or restrict access to all or part of our site for business or operational reasons.

You are responsible for ensuring that all persons who access our site through your internet connection are aware of and comply with these terms.

---

## **We may transfer this agreement to someone else**

We may transfer our rights and obligations under these terms to another organisation.
If that happens, we will notify you and ensure the transfer does not affect your rights.

---

## **Our site is global**

Our site is directed to people worldwide.

---

## **You must keep your account details safe**

If you receive or choose a user ID, password, or other security information, you must keep it confidential and not disclose it to any third party.

We may disable your account credentials if we believe you have breached these terms.

If you suspect someone else knows your login details, contact us immediately at **[support@maestrolearningplatform.com](mailto:support@maestrolearningplatform.com)**.

---

## **How you may use material on our site**

We are the owner or licensee of all intellectual property rights in our site, including text, graphics, images, and other materials.

You may:

* print one copy
* download extracts
* draw attention to site content within your organisation

You **must not**:

* modify copies of materials
* use illustrations or graphics separately from accompanying text
* use content for commercial purposes without permission
* redistribute or repost our content unlawfully

If you breach these rules, your right to use our site ceases immediately.

---

## **No text or data mining, or web scraping**

You are strictly prohibited from:

* text or data mining
* scraping
* crawling
* automated extraction of content
* using our content to train or develop AI systems

This includes automated tools such as bots, spiders, and scrapers.

Use of our site for AI training is **not permitted** unless expressly authorised.

This clause does not apply where such activities cannot legally be excluded.

By using our site, you confirm you are legally permitted to do so in your location.

---

## **Rules about linking to our site**

You may link to our home page **only if**:

* the link is fair and legal
* it does not damage our reputation
* it does not imply our endorsement where none exists

You **must not**:

* link from a site you do not own
* frame our site
* link to any page other than the home page

We may withdraw linking permission at any time.

To request additional linking rights, contact **[support@maestrolearningplatform.com](mailto:support@maestrolearningplatform.com)**.

---

## **Our trademarks are registered**

Our trademarks are registered in Nigeria. You may not use them without our prior written consent.

---

## **Uploading content to our site**

If you upload, share, or interact with content on our site:

* you must comply with our content standards
* you warrant that your content meets these standards
* you agree to indemnify us for any breach
* your content is treated as non-confidential and non-proprietary

We may disclose your identity to third parties who claim:

* intellectual property infringement
* privacy rights violation

We may remove any non-compliant content at our discretion.

### **Licences you grant us**

When you upload content, you grant us:

* a worldwide, non-exclusive, royalty-free, transferable licence
* to use, reproduce, distribute, prepare derivative works, display, and perform that content
* for as long as the content remains on our site

You also grant other users and partners a similar licence, consistent with site functionality.

---

## **User-generated content is not approved by us**

Content posted by users has not been verified or approved by us.
Opinions expressed by users do not represent our views or values.

---

## **Do not rely on information on this site**

Content on our site is for **general information only**.

It is **not** professional advice.
Seek independent professional guidance before acting on any information on our site.

We make no guarantees that content is:

* accurate
* complete
* up to date

---

## **We are not responsible for websites we link to**

Links to third-party websites are for information only.
We do not endorse or control third-party content.

---

## **We are not responsible for viruses**

We do not guarantee that our site is secure or virus-free.
Use your own virus protection software.

---

## **You must not introduce viruses**

You must **not**:

* introduce malware, viruses, worms, or trojans
* attempt to gain unauthorised access
* interfere with site functionality
* attack our site, servers, network, or dependencies

We will report any such breach to law enforcement and disclose your identity.
Your right to use our site will cease immediately.

---

## **Our responsibility for loss or damage**

We limit our liability to the fullest extent permitted by law.

### **If you are a business user, we are not liable for:**

* loss of profits, revenue, or savings
* business interruption
* loss of goodwill or reputation
* indirect or consequential loss

### **If you are a consumer user:**

Our site is for private use only.
We are not liable for business-related losses.

We are not liable for damage caused by:

* failure to install updates
* failure to follow instructions
* not meeting system requirements

---

## **How we use your personal information**

We use your personal data only as described in our [Privacy Policy](${this.webURL}/privacy-policy).

---

## **Which country’s laws apply**

These terms are governed by **Nigerian law**.
All disputes shall be resolved exclusively by the courts of **Nigeria**.

  `

  scrollToTop () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  ngOnInit(): void {
      this.scrollToTop();
  }
}
