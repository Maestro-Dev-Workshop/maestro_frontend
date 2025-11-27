import { Component, OnInit } from '@angular/core';
import { MarkdownPipe } from '../../../shared/pipes/markdown-pipe';

@Component({
  selector: 'app-privacy-policy',
  imports: [MarkdownPipe],
  templateUrl: './privacy-policy.html',
  styleUrl: './privacy-policy.css',
})
export class PrivacyPolicy implements OnInit {
  privacyPolicyMarkdown: string = `

# **OVERMIND TECHNOLOGIES NIGERIA LIMITED — PRIVACY POLICY**

## **Introduction**

This Privacy Policy (“Policy”) sets out the basis on which any personally identifiable information (“Personal Data”) Overmind Technologies Nigeria Limited (“Overmind”, “we”, “us”, “our”) collects from you, or that you provide to us, will be processed by us. It applies to our platform, website, and all databases, applications, services, tools, and physical contact with us (“Platform”), regardless of how you access or use them.

Through our Platform, we provide the business of building, developing, and releasing software products, particularly those leveraging artificial intelligence and other emerging technologies, for use by individuals, enterprises, and institutions.

Kindly read and understand the terms of this Policy carefully before using our Platform. If you disagree in any way with the terms stated herein, you should not use or access our Platform. By clicking on the “accept” button, you are accepting and consenting to the practices described in this Policy.

If you have any comments on this Policy, please email: **[overmindevs@gmail.com](mailto:overmindevs@gmail.com)**

---

## **CONTENTS OF THIS POLICY**

1. What information we use and how we collect same
2. Use of your Personal Data
3. Data protection principles
4. Your rights regarding the use of your Personal Data
5. Sharing your Personal Data
6. Retention periods
7. Data security
8. Storage and transfer to foreign country
9. Links to other websites and premises
10. Changes to this Privacy Policy
11. Inquiries

---

# **WHAT INFORMATION WE USE AND HOW WE COLLECT SAME**

To effectively provide Services to you, we collect and securely store the information you supply to us. This includes your identity data, contact details, company information, delivery address, and financial data. We gather this data when you engage with our Platform.

### **Business and Personal Data**

When you access our Platform, you may complete forms requiring information such as:

* Personal details
* Company registration number
* Office address
* Management information
* Board of directors’ composition

We collect such data to provide and improve our Services. We may also use/store/transfer your Personal Data for marketing and data optimization purposes.

### **Technical Information and Analytics**

When you use our Platform, we may automatically collect the following information (depending on your device settings):

* IP address
* Login information
* Device and operating system details
* Browser version
* Time zone
* Location (based on IP)
* Pages viewed
* Interaction information (e.g., button clicks)
* Customer service call phone number
* Website response times

### **Cookies**

Cookies and similar technologies may be used to collect information such as your interactions with our Platform. We use only encrypted **session cookies** to track activity during a session. These are erased after timeout, logout, or browser close.

Session cookies do **not** collect Personal Data; they store session IDs that do not identify the user personally.

---

# **USE OF YOUR PERSONAL DATA**

We use your Personal Data for the following purposes:

* To provide you with support and assist you on our Platform
* To register your account and process your Service requests
* To respond to reviews, comments, and feedback
* As necessary to establish, exercise, or defend legal rights
* To evaluate and improve our Platform and develop new Services
* To administer, promote, and communicate our Services
* To prevent and combat fraud
* To contact you with marketing content or surveys (you may opt out)
* To personalize your experience and improve security
* For third-party processing
* For legitimate business purposes not incompatible with privacy laws

---

# **DATA PROTECTION PRINCIPLES**

We ensure that your data is:

* Processed for specific, legitimate, lawful purposes
* Stored only for necessary periods
* Adequate, relevant, and limited to necessity
* Accurate and up to date
* Complete and not misleading
* Reasonably secured against foreseeable hazards such as cyberattacks, theft, and unauthorized dissemination

We are not liable for breaches occurring through no fault of ours.

---

# **YOUR RIGHTS REGARDING THE USE OF YOUR PERSONAL DATA**

You have the right to:

* **Withdraw consent** at any time (note: withdrawing may affect Service delivery)
* **Restrict processing** pending determination of legitimate grounds
* **Request deletion** of your data (subject to lawful retention requirements)
* **Request access** to your data free of charge (fees may apply for manifestly excessive/unfounded requests)
* **Contest accuracy** and request correction of your data

You may lodge complaints with the **Nigeria Data Protection Commission (NDPC)**.
We recommend contacting us first via **[overmindevs@gmail.com](mailto:overmindevs@gmail.com)**.

---

# **SHARING AND DISCLOSING YOUR PERSONAL DATA**

We may share your data:

* With members of our corporate group and partners
* With contracted service providers acting as data processors under confidentiality obligations
* With commercial partners in aggregated, non-identifiable form
* To comply with legal obligations, defend rights, or prevent fraud/security threats

---

# **RETENTION PERIODS**

* Your data is retained only as long as necessary.
* Personal Data is stored as long as your client account is active.
* Upon account closure, data is deleted per our retention schedule unless required for accounting, dispute resolution, or fraud prevention.

---

# **DATA SECURITY**

We implement technical and operational safeguards to prevent unauthorized access and ensure secure processing.

### **Security of Personal Data**

* You are responsible for keeping your passwords confidential.
* No internet transmission is 100% secure; you must follow our security guidelines.
* We are not liable for unauthorized access except where due to our willful misconduct.

### **Breach / Privacy Violation**

In the event of a data breach:

* We notify the NDPC within **72 hours**
* If the breach risks your rights/freedoms, we notify you within **7 days** (or immediately if confirmed later)

---

# **STORAGE AND TRANSFER TO FOREIGN COUNTRY**

Your data may be stored/processed outside Nigeria in accordance with applicable privacy laws.

* Transfers will comply with NDPC whitelist or adequate safeguards
* Transfers to non-whitelist countries require:

  * Adequate safeguards
  * Written agreements with mandatory security measures
  * Your consent

---

# **LINKS TO OTHER WEBSITES AND PREMISES**

Our Platform may contain links to third-party sites. We do not control or monitor these sites.

Users should:

* Read privacy policies of third-party websites
* Evaluate safety before disclosing Personal Data

We are not responsible for third-party privacy practices or resulting loss/damage.

---

# **CHANGES TO THIS PRIVACY POLICY**

We may modify this Policy without prior notice.
Your continued use of our Platform constitutes acceptance of the updated Policy.

---

# **INQUIRIES**

For questions or to exercise your data rights, contact our Data Protection Officer:

**+234 813 869 7269**

  `

  scrollToTop () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  ngOnInit(): void {
      this.scrollToTop();
  }
}
