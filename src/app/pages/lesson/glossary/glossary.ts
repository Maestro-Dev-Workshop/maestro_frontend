import { Component, computed, input, output, signal } from '@angular/core';
import { MarkdownPipe } from '../../../shared/pipes/markdown-pipe';
import { ViewportScroller } from '@angular/common';

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

  arrangedGlossary = computed(() => {
    // create an array of objects for each letter with corresponding terms, use # to represent non-alphabetical starting terms
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    return alphabet.map(letter => {
      return {
        letter,
        terms: this.glossaryItems().filter((item: any) => item.term.toLowerCase().startsWith(letter.toLowerCase()))
      };
    }).filter(group => group.terms.length > 0); // only include letters that have terms
  })

  constructor(private vscroller: ViewportScroller) {}

  scrollToElement(id: string) {
    console.log('Scrolling to element with id:', id);
    // get the vertical position of the element with id = id, then emit that position value
    const el = document.getElementById(id);
    if (el) {
      const position = el.getBoundingClientRect().top;
      console.log('Element position:', position);
      this.scroll.emit(position);
    }
  }
}
