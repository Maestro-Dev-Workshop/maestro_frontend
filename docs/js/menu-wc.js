'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">maestro-frontend documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                                <li class="link">
                                    <a href="overview.html" data-type="chapter-link">
                                        <span class="icon ion-ios-keypad"></span>Overview
                                    </a>
                                </li>

                            <li class="link">
                                <a href="index.html" data-type="chapter-link">
                                    <span class="icon ion-ios-paper"></span>
                                        README
                                </a>
                            </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>

                    </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#components-links"' :
                            'data-bs-target="#xs-components-links"' }>
                            <span class="icon ion-md-cog"></span>
                            <span>Components</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="components-links"' : 'id="xs-components-links"' }>
                            <li class="link">
                                <a href="components/About.html" data-type="entity-link" >About</a>
                            </li>
                            <li class="link">
                                <a href="components/App.html" data-type="entity-link" >App</a>
                            </li>
                            <li class="link">
                                <a href="components/Chatbot.html" data-type="entity-link" >Chatbot</a>
                            </li>
                            <li class="link">
                                <a href="components/ConfirmLogout.html" data-type="entity-link" >ConfirmLogout</a>
                            </li>
                            <li class="link">
                                <a href="components/Contact.html" data-type="entity-link" >Contact</a>
                            </li>
                            <li class="link">
                                <a href="components/CreationStepTab.html" data-type="entity-link" >CreationStepTab</a>
                            </li>
                            <li class="link">
                                <a href="components/Features.html" data-type="entity-link" >Features</a>
                            </li>
                            <li class="link">
                                <a href="components/Header.html" data-type="entity-link" >Header</a>
                            </li>
                            <li class="link">
                                <a href="components/Home.html" data-type="entity-link" >Home</a>
                            </li>
                            <li class="link">
                                <a href="components/Landing.html" data-type="entity-link" >Landing</a>
                            </li>
                            <li class="link">
                                <a href="components/LessonPage.html" data-type="entity-link" >LessonPage</a>
                            </li>
                            <li class="link">
                                <a href="components/Login.html" data-type="entity-link" >Login</a>
                            </li>
                            <li class="link">
                                <a href="components/NamingUpload.html" data-type="entity-link" >NamingUpload</a>
                            </li>
                            <li class="link">
                                <a href="components/NotFound.html" data-type="entity-link" >NotFound</a>
                            </li>
                            <li class="link">
                                <a href="components/Practice.html" data-type="entity-link" >Practice</a>
                            </li>
                            <li class="link">
                                <a href="components/Pricing.html" data-type="entity-link" >Pricing</a>
                            </li>
                            <li class="link">
                                <a href="components/QuestionSettings.html" data-type="entity-link" >QuestionSettings</a>
                            </li>
                            <li class="link">
                                <a href="components/Sidebar.html" data-type="entity-link" >Sidebar</a>
                            </li>
                            <li class="link">
                                <a href="components/Signup.html" data-type="entity-link" >Signup</a>
                            </li>
                            <li class="link">
                                <a href="components/Subjects.html" data-type="entity-link" >Subjects</a>
                            </li>
                            <li class="link">
                                <a href="components/Subscription.html" data-type="entity-link" >Subscription</a>
                            </li>
                            <li class="link">
                                <a href="components/Subtopic.html" data-type="entity-link" >Subtopic</a>
                            </li>
                            <li class="link">
                                <a href="components/Toast.html" data-type="entity-link" >Toast</a>
                            </li>
                            <li class="link">
                                <a href="components/TopicPreferences.html" data-type="entity-link" >TopicPreferences</a>
                            </li>
                            <li class="link">
                                <a href="components/VerifyEmail.html" data-type="entity-link" >VerifyEmail</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#directives-links"' :
                                'data-bs-target="#xs-directives-links"' }>
                                <span class="icon ion-md-code-working"></span>
                                <span>Directives</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="directives-links"' : 'id="xs-directives-links"' }>
                                <li class="link">
                                    <a href="directives/FileTypeDirective.html" data-type="entity-link" >FileTypeDirective</a>
                                </li>
                                <li class="link">
                                    <a href="directives/PasswordValidator.html" data-type="entity-link" >PasswordValidator</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#classes-links"' :
                            'data-bs-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/ExamSettings.html" data-type="entity-link" >ExamSettings</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExerciseSettings.html" data-type="entity-link" >ExerciseSettings</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AuthService.html" data-type="entity-link" >AuthService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ChatbotService.html" data-type="entity-link" >ChatbotService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ExerciseService.html" data-type="entity-link" >ExerciseService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/HttpBaseService.html" data-type="entity-link" >HttpBaseService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/LessonService.html" data-type="entity-link" >LessonService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/NotificationService.html" data-type="entity-link" >NotificationService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SubjectsService.html" data-type="entity-link" >SubjectsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SubscriptionService.html" data-type="entity-link" >SubscriptionService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UserService.html" data-type="entity-link" >UserService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interceptors-links"' :
                            'data-bs-target="#xs-interceptors-links"' }>
                            <span class="icon ion-ios-swap"></span>
                            <span>Interceptors</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="interceptors-links"' : 'id="xs-interceptors-links"' }>
                            <li class="link">
                                <a href="interceptors/AuthInterceptor.html" data-type="entity-link" >AuthInterceptor</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#guards-links"' :
                            'data-bs-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/SubscriptionGuard.html" data-type="entity-link" >SubscriptionGuard</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/AnswerModel.html" data-type="entity-link" >AnswerModel</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ChatMessage.html" data-type="entity-link" >ChatMessage</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ExamModel.html" data-type="entity-link" >ExamModel</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ExerciseModel.html" data-type="entity-link" >ExerciseModel</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/LoginPayload.html" data-type="entity-link" >LoginPayload</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/LoginResponse.html" data-type="entity-link" >LoginResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Plan.html" data-type="entity-link" >Plan</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/QuestionModel.html" data-type="entity-link" >QuestionModel</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/QuestionOption.html" data-type="entity-link" >QuestionOption</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SaveQuestionData.html" data-type="entity-link" >SaveQuestionData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SignupPayload.html" data-type="entity-link" >SignupPayload</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SubscriptionStatus.html" data-type="entity-link" >SubscriptionStatus</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SubtopicModel.html" data-type="entity-link" >SubtopicModel</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TopicModel.html" data-type="entity-link" >TopicModel</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UserModel.html" data-type="entity-link" >UserModel</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/VerifyEmailResponse.html" data-type="entity-link" >VerifyEmailResponse</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#pipes-links"' :
                                'data-bs-target="#xs-pipes-links"' }>
                                <span class="icon ion-md-add"></span>
                                <span>Pipes</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="pipes-links"' : 'id="xs-pipes-links"' }>
                                <li class="link">
                                    <a href="pipes/MarkdownPipe.html" data-type="entity-link" >MarkdownPipe</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});