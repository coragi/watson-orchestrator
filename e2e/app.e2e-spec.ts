import { WatsonOrchestratorPage } from './app.po';

describe('watson-orchestrator App', () => {
  let page: WatsonOrchestratorPage;

  beforeEach(() => {
    page = new WatsonOrchestratorPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
