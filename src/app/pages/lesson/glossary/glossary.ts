import { Component, computed, effect, ElementRef, input, output, signal, untracked, viewChild } from '@angular/core';
import { MarkdownPipe } from '../../../shared/pipes/markdown-pipe';
import { ThemeIconComponent } from '../../../shared/components/theme-icon/theme-icon';

@Component({
  selector: 'app-glossary',
  imports: [MarkdownPipe],
  templateUrl: './glossary.html',
  styleUrl: './glossary.css',
})
export class Glossary {
  glossaryItems = input<any>();
  // glossaryStuff = signal([
  //   {
  //     term: 'Algorithm',
  //     definition: 'A step-by-step procedure for solving a problem or performing a task.'
  //   },
  //   {
  //     term: 'API',
  //     definition: 'A set of rules and protocols for building and interacting with software applications.'
  //   },
  //   {
  //     term: 'Argument',
  //     definition: 'A value passed to a function when it is called.'
  //   },
  //   {
  //     term: 'Array',
  //     definition: 'An ordered collection of elements stored under a single variable name.'
  //   },
  //   {
  //     term: 'Authentication',
  //     definition: 'The process of verifying the identity of a user or system.'
  //   },
  //   {
  //     term: 'Authorization',
  //     definition: 'The process of determining what actions a user is allowed to perform.'
  //   },
  //   {
  //     term: 'Boolean',
  //     definition: 'A data type with only two possible values: true or false.'
  //   },
  //   {
  //     term: 'Branch',
  //     definition: 'A parallel version of code used for isolated development.'
  //   },
  //   {
  //     term: 'Class',
  //     definition: 'A blueprint for creating objects that defines properties and methods.'
  //   },
  //   {
  //     term: 'Commit',
  //     definition: 'A saved snapshot of changes in a version control system.'
  //   },
  //   {
  //     term: 'Compiler',
  //     definition: 'A program that translates source code into machine code.'
  //   },
  //   {
  //     term: 'Conditional',
  //     definition: 'A statement that executes code based on whether a condition is true or false.'
  //   },
  //   {
  //     term: 'Constant',
  //     definition: 'A variable whose value cannot be changed after it is assigned.'
  //   },
  //   {
  //     term: 'Data Structure',
  //     definition: 'A way of organizing and storing data to enable efficient access and modification.'
  //   },
  //   {
  //     term: 'Database',
  //     definition: 'An organized collection of structured data.'
  //   },
  //   {
  //     term: 'Debugging',
  //     definition: 'The process of identifying and fixing errors in code.'
  //   },
  //   {
  //     term: 'Encryption',
  //     definition: 'The practice of securing data by converting it into a coded format.'
  //   },
  //   {
  //     term: 'Endpoint',
  //     definition: 'A specific URL where an API can be accessed.'
  //   },
  //   {
  //     term: 'Exception',
  //     definition: 'An error that occurs during program execution.'
  //   },
  //   {
  //     term: 'Float',
  //     definition: 'A number that includes a decimal point.'
  //   },
  //   {
  //     term: 'Framework',
  //     definition: 'A structured platform that provides tools and conventions for application development.'
  //   },
  //   {
  //     term: 'Function',
  //     definition: 'A reusable block of code that performs a specific task.'
  //   },
  //   {
  //     term: 'Git',
  //     definition: 'A distributed version control system used to manage source code.'
  //   },
  //   {
  //     term: 'HTTP',
  //     definition: 'A protocol used for transmitting data over the web.'
  //   },
  //   {
  //     term: 'Index',
  //     definition: 'A data structure that improves the speed of data retrieval operations.'
  //   },
  //   {
  //     term: 'Integer',
  //     definition: 'A whole number without a fractional component.'
  //   },
  //   {
  //     term: 'Interpreter',
  //     definition: 'A program that executes code line by line without prior compilation.'
  //   },
  //   {
  //     term: 'Iteration',
  //     definition: 'The repeated execution of a set of instructions.'
  //   },
  //   {
  //     term: 'JSON',
  //     definition: 'A lightweight data-interchange format that is easy to read and write.'
  //   },
  //   {
  //     term: 'Library',
  //     definition: 'A collection of prewritten code that developers can reuse.'
  //   },
  //   {
  //     term: 'Loop',
  //     definition: 'A control structure that repeatedly executes a block of code while a condition is true.'
  //   },
  //   {
  //     term: 'Merge',
  //     definition: 'The process of combining changes from different branches.'
  //   },
  //   {
  //     term: 'Normalization',
  //     definition: 'The process of organizing database data to reduce redundancy.'
  //   },
  //   {
  //     term: 'Object',
  //     definition: 'An instance of a class that encapsulates data and behavior.'
  //   },
  //   {
  //     term: 'Parameter',
  //     definition: 'A variable defined in a function declaration to receive input values.'
  //   },
  //   {
  //     term: 'Performance',
  //     definition: 'A measure of how fast and efficiently a system operates.'
  //   },
  //   {
  //     term: 'Query',
  //     definition: 'A request for data or information from a database.'
  //   },
  //   {
  //     term: 'Recursion',
  //     definition: 'A technique where a function calls itself to solve a problem.'
  //   },
  //   {
  //     term: 'Repository',
  //     definition: 'A centralized location where code and its history are stored.'
  //   },
  //   {
  //     term: 'REST',
  //     definition: 'An architectural style for designing networked applications.'
  //   },
  //   {
  //     term: 'Return Value',
  //     definition: 'The value that a function sends back after execution.'
  //   },
  //   {
  //     term: 'Runtime',
  //     definition: 'The period when a program is executing.'
  //   },
  //   {
  //     term: 'Scalability',
  //     definition: 'The ability of a system to handle increased workload efficiently.'
  //   },
  //   {
  //     term: 'Scope',
  //     definition: 'The region of a program where a variable is accessible.'
  //   },
  //   {
  //     term: 'String',
  //     definition: 'A sequence of characters used to represent text.'
  //   },
  //   {
  //     term: 'Syntax',
  //     definition: 'The set of rules that defines the structure of valid code.'
  //   },
  //   {
  //     term: 'Variable',
  //     definition: 'A named storage location in a program that holds a value.'
  //   },
  //   {
  //     term: 'Version Control',
  //     definition: 'A system that tracks changes to code over time.'
  //   }
  // ])
  scroll = output<any>();
  mainGlossary = viewChild<ElementRef>('mainGlossary');
  sideNavigation = viewChild<ElementRef>('sideNavigation');

  arrangedGlossary = computed(() => {
    // create an array of objects for each letter with corresponding terms, use # to represent non-alphabetical starting terms
    const arranged: { letter: string, terms: any[] }[] = [];
    const groupedTerms: { [key: string]: any[] } = {};
    this.glossaryItems().forEach((item: any) => {
      const firstChar = item.term.charAt(0).toUpperCase();
      const key = /[A-Z]/.test(firstChar) ? firstChar : '#';
      if (!groupedTerms[key]) {
        groupedTerms[key] = [];
      }
      groupedTerms[key].push(item);
    });
    Object.keys(groupedTerms).forEach(letter => {
      arranged.push({ letter, terms: groupedTerms[letter] });
    });
    return arranged.sort((a, b) => a.letter.localeCompare(b.letter));
  })

  constructor() {}

  private updateOnInputChange = effect(() => {
    const view = this.glossaryItems();
    if (view?.length) {
      untracked(() => {
        setTimeout(() => this.scrollToTop(), 0);
      });
    }
  });

  scrollToTop() {
    const el1 = this.mainGlossary();
    if (el1?.nativeElement) {
      el1.nativeElement.scrollTop = 0;
    }
    const el2 = this.sideNavigation();
    if (el2?.nativeElement) {
      el2.nativeElement.scrollTop = 0;
    }
  }

  scrollToElement(id: string) {
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

  // Had to force smooth scrolling
  scrollToElementSmooth(id: string) {
    const glossaryContainer = this.mainGlossary();
    if (glossaryContainer?.nativeElement) {
      const target = document.getElementById(id);
      if (target) {
        const container = glossaryContainer.nativeElement;
        const containerRect = container.getBoundingClientRect();
        const targetRect = target.getBoundingClientRect();
        
        const targetPosition = container.scrollTop + (targetRect.top - containerRect.top) - 20;
        const startPosition = container.scrollTop;
        const distance = targetPosition - startPosition;
        const duration = 500; // milliseconds
        let startTime: number | null = null;
  
        const animation = (currentTime: number) => {
          if (startTime === null) startTime = currentTime;
          const timeElapsed = currentTime - startTime;
          const progress = Math.min(timeElapsed / duration, 1);
          
          // Easing function for smooth animation
          const ease = progress < 0.5 
            ? 2 * progress * progress 
            : 1 - Math.pow(-2 * progress + 2, 2) / 2;
          
          container.scrollTop = startPosition + (distance * ease);
          
          if (timeElapsed < duration) {
            requestAnimationFrame(animation);
          }
        };
  
        requestAnimationFrame(animation);
      }
    }
  }
}
