import { AwdValicBatchBalancePage } from './app.po';

describe('awd-valic-batch-balance App', function() {
  let page: AwdValicBatchBalancePage;

  beforeEach(() => {
    page = new AwdValicBatchBalancePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
