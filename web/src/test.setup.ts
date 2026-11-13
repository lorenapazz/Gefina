
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Limpa os componentes renderizados após cada teste
afterEach(cleanup);

HTMLDialogElement.prototype.showModal = function(this: HTMLDialogElement){
this.open = true;
}

HTMLDialogElement.prototype.close = function(this: HTMLDialogElement){
this.open = false;
this.dispatchEvent(new Event('close'));
};
