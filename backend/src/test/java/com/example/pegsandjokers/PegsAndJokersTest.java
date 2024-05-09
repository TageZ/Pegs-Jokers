package com.example.pegsandjokers;

import com.example.pegsandjokers.api.controller.model.*;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class PegsAndJokersTest {

	public static final int HEAVENS_GATE = 2;
	public static final int HOME_STEP = 7;
	public static final int NUM_PLAYERS = 4;
	public static final int SIZE_OF_HEAVEN = 5;
	public static final int SIZE_OF_BOARD_SEGMENT = 18;
	public static final int DECK_SIZE = 54;
	public Game g = new Game("test");

	@Test
	public void testInitalizeBoardCreatesCorrectSizeLoop(){
		//Setup
		Board b = g.getBoard();
		int expected = NUM_PLAYERS * SIZE_OF_BOARD_SEGMENT;

		//Execute
		int actual = b.getLoop().length;

		//Test
		assertEquals(expected, actual);
	}

	@Test
	public void testInitalizeBoardCreatesCorrectSizeHeavens(){
		//Setup
		Board b = g.getBoard();

        //Execute
		int actual_row = b.getHeavens().length;
		int actual_col = b.getHeavens()[0].length;

		//Test
		assertEquals(NUM_PLAYERS, actual_row);
		assertEquals(SIZE_OF_HEAVEN, actual_col);
	}

	@Test
	public void testGetHoleIndexStart(){
		//Setup
		Board b = g.getBoard();
		int expected = 0;
		Hole h = b.getLoop()[expected];

		//Execute
		int actual = b.getHoleIndex(h);

		//Test
		assertEquals(expected, actual);
	}

	@Test
	public void testGetHoleIndexMiddle(){
		//Setup
		Board b = g.getBoard();
		int expected = 30;
		Hole h = b.getLoop()[expected];

		//Execute
		int actual = b.getHoleIndex(h);

		//Test
		assertEquals(expected, actual);
	}

	@Test
	public void testGetHoleIndexEnd(){
		//Setup
		Board b = g.getBoard();
		int expected = b.getLoop().length - 1;
		Hole h = b.getLoop()[expected];

		//Execute
		int actual = b.getHoleIndex(h);

		//Test
		assertEquals(expected, actual);
	}

	@Test
	public void testDeckInitializesCorrectly(){
		//Setup
		Deck d = new Deck();
		int expected = 54;

		//Execute
		int actual = d.getCards().size();

		//Test
		assertEquals(expected, actual);
	}

	@Test
	public void testGetRandomCardShrinksAndInitializesDeck(){
		//Setup
		Game g = new Game("test");
		while (!g.getDeck().getCards().isEmpty()){
			g.getRandomCard();
		}
		int expected = DECK_SIZE - 1;

		//Execute
		g.getRandomCard();
		int actual = g.getDeck().getCards().size();

		//Test
		assertEquals(expected, actual);
	}

	@Test
	public void testMovePegOut(){
		//Setup
		Game g = new Game("test");
		Player p = g.getPlayers()[0];

		//Execute
		g.getOut(p.getPegs().get(0));

		//Test
		assert(g.getBoard().getLoop()[HOME_STEP].getPeg() != null);
	}

	@Test
	public void testCantMovePegOutOnColor(){
		//Setup
		Game g = new Game("test");
		Player p = g.getPlayers()[0];

		//Execute
		g.getOut(p.getPegs().get(0));

		//Test
		assertFalse(g.getOut(p.getPegs().get(1)));
	}

	@Test
	public void testSwitchWithNonPartner(){
		//Setup
		Game g = new Game("test");
		Player p = g.getPlayers()[0];
		Player p2 = g.getPlayers()[1];
		Peg peg1 = p.getPegs().get(0);
		Peg peg2 = p2.getPegs().get(0);

		//Execute
		g.getOut(peg1);
		g.getOut(peg2);
		Hole h1 = peg1.getHole();
		Hole h2 = peg2.getHole();
		g.swap(peg1,peg2);

		//Test
		assertEquals(h1, peg2.getHole());
		assertEquals(h2, peg1.getHole());
	}

	@Test
	public void testSwitchWithPartner(){
		//Setup
		Game g = new Game("test");
		Player p = g.getPlayers()[0];
		Player p2 = g.getPlayers()[2];
		Peg peg1 = p.getPegs().get(0);
		Peg peg2 = p2.getPegs().get(0);

		//Execute
		g.getOut(peg1);
		g.getOut(peg2);
		Hole h1 = peg1.getHole();
		Hole h2 = peg2.getHole();
		g.swap(peg1,peg2);

		//Test
		assertEquals(h1, peg2.getHole());
		assertEquals(h2, peg1.getHole());
	}

	@Test
	public void testLandingOnTeammateSendsToHeavensGate(){
		//Setup
		Game g = new Game("test");
		Player p = g.getPlayers()[0];
		Player p2 = g.getPlayers()[2];
		Peg peg1 = p.getPegs().get(0);
		Peg peg2 = p2.getPegs().get(0);

		//Execute
		g.getOut(peg1);
		g.getOut(peg2);
		g.swap(peg1,peg2);
		g.getOut(p2.getPegs().get(1));

		//Test
		assertEquals(g.getBoard().getLoop()[HEAVENS_GATE].getPeg(), peg1);
	}

	@Test
	public void testLandingOnTeammateSendsHome(){
		//Setup
		Game g = new Game("test");
		Player p = g.getPlayers()[0];
		Player p2 = g.getPlayers()[1];
		Peg peg1 = p.getPegs().get(0);
		Peg peg2 = p2.getPegs().get(0);

		//Execute
		g.getOut(peg1);
		g.getOut(peg2);
		g.swap(peg1,peg2);
		g.getOut(p2.getPegs().get(1));

		//Test
		assert(peg1.getInHome());
	}

	@Test
	public void testIsWinnerWhenNoWinner(){
		//Setup
		Game g = new Game("test");
		boolean expected = false;

		//Execute
		boolean actual = g.isWinner();

		//Test
		assertEquals(expected, actual);
	}

	@Test
	public void testIsWinnerWhenWinner(){
		//Setup
		Game g = new Game("test");
		Player p = g.getPlayers()[0];
		Player p2 = g.getPlayers()[2];
		for (Peg peg : p.getPegs()){
			peg.setInHeaven(true);
		}
		for (Peg peg : p2.getPegs()){
			peg.setInHeaven(true);
		}
		boolean expected = true;

		//Execute
		boolean actual = g.isWinner();

		//Test
		assertEquals(expected, actual);
	}

	@Test
	public void testGameEquals(){
		//Setup
		Game g = new Game("test");
		Game g0 = new Game("test");
		Game g1 = new Game("test-2");

		//Test
		assertEquals(g, g0);
		assertNotEquals(g, g1);
	}

	@Test
	public void testMovePegForward(){
		//Setup
		Game g = new Game("test");
		Player p = g.getPlayers()[0];
		Peg peg = p.getPegs().get(0);

		//Execute
		g.getOut(peg);
		g.move(peg, new Card(Value.TEN));

		//Test
		assertEquals(g.getBoard().getLoop()[HOME_STEP + 10].getPeg(), peg);
	}

	@Test
	public void testMovePegBackward(){
		//Setup
		Game g = new Game("test");
		Player p = g.getPlayers()[0];
		Peg peg = p.getPegs().get(0);
		Hole[] loop = g.getBoard().getLoop();

		//Execute
		g.getOut(peg);
		g.move(peg, new Card(Value.EIGHT));

		//Test
		assertEquals(loop[loop.length - 1].getPeg(), peg);
	}

	@Test
	public void testMoveOntoEnemy(){
		//Setup
		Game g = new Game("test");
		Player p = g.getPlayers()[0];
		Player p2 = g.getPlayers()[1];
		Peg peg = p.getPegs().get(0);
		Peg peg2 = p2.getPegs().get(0);

		//Execute
		g.getOut(peg);
		g.getOut(peg2);
		g.move(peg2, new Card(Value.EIGHT));
		g.move(peg, new Card(Value.TEN));

		//Test
		assert(peg2.getInHome());
	}

	@Test
	public void testMoveOntoPartner(){
		//Setup
		Game g = new Game("test");
		Player p = g.getPlayers()[0];
		Player p2 = g.getPlayers()[2];
		Peg peg = p.getPegs().get(0);
		Peg peg2 = p2.getPegs().get(0);

		//Execute
		g.getOut(peg);
		g.setPegOnHole(peg2, g.getBoard().getLoop()[HOME_STEP + 10]);
		g.move(peg, new Card(Value.TEN));

		//Test
		assertEquals(g.getBoard().getLoop()[SIZE_OF_BOARD_SEGMENT * 2 + HEAVENS_GATE].getPeg(), peg2);
	}

	@Test
	public void testCantMoveOntoSame(){
		//Setup
		Game g = new Game("test");
		Player p = g.getPlayers()[0];
		Peg peg = p.getPegs().get(0);
		Peg peg2 = p.getPegs().get(1);

		//Execute
		g.getOut(peg);
		g.setPegOnHole(peg2, g.getBoard().getLoop()[HOME_STEP + 1]);

		//Test
		assertFalse(g.move(peg, new Card(Value.ACE)));
	}

	@Test
	public void testCantMoveOverSame(){
		//Setup
		Game g = new Game("test");
		Player p = g.getPlayers()[0];
		Peg peg = p.getPegs().get(0);
		Peg peg2 = p.getPegs().get(1);

		//Execute
		g.getOut(peg);
		g.setPegOnHole(peg2, g.getBoard().getLoop()[HOME_STEP + 1]);

		//Test
		assertFalse(g.move(peg, new Card(Value.TEN)));
	}

	@Test
	public void splitForward(){
		//Setup
		Game g = new Game("test");
		Player p = g.getPlayers()[0];
		Player p2 = g.getPlayers()[0];
		Peg peg = p.getPegs().get(0);
		Peg peg2 = p2.getPegs().get(0);

		//Execute
		g.getOut(peg);
		g.getOut(peg2);

		//Test
		assert(g.splitMove(peg, peg2, new Card(Value.SEVEN), 5, true));
	}

	@Test
	public void splitBackward(){
		//Setup
		Game g = new Game("test");
		Player p = g.getPlayers()[0];
		Peg peg = p.getPegs().get(0);
		Peg peg2 = p.getPegs().get(1);

		//Execute
		g.getOut(peg);
		g.setPegOnHole(peg2, g.getBoard().getLoop()[HOME_STEP - 1]);

		//Test
		assert(g.splitMove(peg, peg2, new Card(Value.NINE), 8, true));
	}

	@Test
	public void movePiecesIntoHeavenEven(){
		//Setup
		Game g = new Game("test");
		Player player = g.getPlayers()[0];
		boolean test = true;
		int count = 0;

		//Execute
		for (Peg peg : player.getPegs()){
			peg.removeFromHome();
			test = g.addPegToHole(peg, player.getHeavensGate());
			test = g.movePeg(peg, 5-count, true);
			count++;
		}

		//Test
		assert(test);
	}

	@Test
	public void movePiecesIntoHeavenOdd(){
		//Setup
		Game g = new Game("test");
		Player player = g.getPlayers()[1];
		boolean test = true;
		int count = 0;

		//Execute
		for (Peg peg : player.getPegs()){
			peg.removeFromHome();
			test = g.addPegToHole(peg, player.getHeavensGate());
			test &= g.movePeg(peg, 5-count, true);
			count++;
		}

		//Test
		assert(test);
	}

	@Test
	public void movePiecesIntoEmptyHeavenSplitMoveEven(){
		//Setup
		Game g = new Game("test");
		Player player = g.getPlayers()[0];
		Player partner = player.getPartner();
		boolean test = true;
		Peg x = player.getPegs().get(0);
		Peg y = partner.getPegs().get(0);

		//Execute
		test &= g.getOut(x);
		test &= g.getOut(y);
		test &= g.splitMove(x, y, new Card(Value.NINE), 6, false);
		test &= g.splitMove(y, x, new Card(Value.NINE), 6, false);
		test &= g.splitMove(x, y, new Card(Value.SEVEN), 3, false);
		test &= g.move(y, new Card(Value.TWO));

		//Test
		assert(test);
	}

	@Test
	public void movePiecesIntoEmptyHeavenSplitMoveOdd(){
		//Setup
		Game g = new Game("test");
		Player player = g.getPlayers()[1];
		Player partner = player.getPartner();
		boolean test = true;
		Peg x = player.getPegs().get(0);
		Peg y = partner.getPegs().get(0);

		//Execute
		test &= g.getOut(x);
		test &= g.getOut(y);
		test &= g.splitMove(x, y, new Card(Value.NINE), 6, false);
		test &= g.splitMove(y, x, new Card(Value.NINE), 6, false);
		test &= g.splitMove(x, y, new Card(Value.SEVEN), 3, false);
		test &= g.move(y, new Card(Value.TWO));

		//Test
		assert(test);
	}
}